import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Pagos } from './entities/pagos.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { PagosType, PaymentStatus, statusGroups } from './interfaces/iPagos';
import { CreatePagoDto } from './dto/createPago.dto';
import Stripe from 'stripe';
import { UpdatePagoDto } from './dto/updatePago.dto';
import { BaseService } from 'src/modules/common/services/base.service';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Carrito } from 'src/modules/carrito/entities/carrito.entity';
import { CarritoConRelaciones } from 'src/modules/carrito/carrito.service';
import { QueryFilters } from '../common/types/query.types';
import { paginateAndFilter, Paginated } from '../common/pagination';
import { StripeService } from 'src/libs/stripe/stripe.service';

@Injectable()
export class PagosService extends BaseService<Pagos, CreatePagoDto, UpdatePagoDto> {
  private readonly logger = new Logger(PagosService.name);

  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
    @InjectRepository(Pagos)
    private pagosRepository: Repository<Pagos>,
    private stripeService: StripeService,
  ) {
    super(pagosRepository);
  }

  /**
   * Crea una sesión de pago único en Stripe y guarda el registro en BD
   */
  async createPaymentSession(reqUser: Usuarios, dto: CreatePagoDto) {
    const cart = await this.getCart(reqUser, dto);
    const session = await this.stripeService.createCheckoutSession(reqUser, cart);

    await this.pagosRepository.update({ carritoId: cart.id }, { carritoId: null });
    const payment = await this.pagosRepository.save({
      user: reqUser,
      stripeSessionId: session.id,
      paymentMethod: 'card',
      paymentAmount: session.amount_total/100,
      type: cart.id ? PagosType.tienda : PagosType.donacion,
      paymentDate: new Date(),
      paymentStatus: PaymentStatus.pending,
      ...(cart.id ? { carrito: cart } : {}),
    });

    if (cart.id) {
      await this.carritoRepository.update(cart.id, { paymentId: payment.clavePrincipal });
    }

    return {
      url: session.url,
      cart,
      message: 'Sesión de pago creada correctamente',
    };
  }

  /**
   * Valida y retorna el carrito para pago
   */
  private async getCart(reqUser: Usuarios, dto: CreatePagoDto): Promise<CarritoConRelaciones> {
    const cart = await this.carritoRepository.findOne({
      where: { userId: reqUser.id, paymentId: IsNull() },
      relations: ['items', 'items.product', 'items.product.image_1', 'payment', 'user'],
    }) as CarritoConRelaciones

    if (!cart) {
      throw new BadRequestException('No hay carrito activo');
    }

    if (cart.items.length === 0) {
      throw new BadRequestException('Carrito sin items');
    }
    return cart;
  }

  /**
   * Procesa el webhook de Stripe
   */
  async handleWebhook(signature: string, payload: Buffer) {
    const event = this.stripeService.verifyWebhookSignature(signature, payload);
    this.logger.log(`Recibido evento Stripe: ${event.type} (ID: ${event.id})`);

    // Idempotencia
    const already = await this.pagosRepository.findOneBy({ stripeEventId: event.id });
    if (already) {
      this.logger.debug(`Evento duplicado ignorado: ${event.id}`);
      return;
    }

    try {
      switch (event.type) {
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded':
        case 'checkout.session.expired':
        case 'payment_intent.succeeded':
        case 'payment_intent.payment_failed':
        case 'charge.succeeded':
        case 'charge.failed':
        case 'charge.refunded':
        case 'refund.created':
        case 'charge.dispute.created':
        case 'charge.dispute.funds_reinstated':
        case 'charge.dispute.funds_withdrawn':
          await this.processEvent(event);
          break;

        default:
          this.logger.debug(`Evento no manejado: ${event.type}`);
      }
    } catch (err) {
      this.logger.error(`Error procesando evento ${event.type}`, err);
      throw new InternalServerErrorException('Error processing webhook');
    }
  }

  /**
   * Procesa y actualiza el pago según evento Stripe
   */
  private async processEvent(event: Stripe.Event) {
    let identifier: FindOptionsWhere<Pagos> = {};
    let status: PaymentStatus = PaymentStatus.pending;

    switch (event.type) {
      // Sesión Checkout
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const sess = event.data.object as Stripe.Checkout.Session;
        identifier = { stripeSessionId: sess.id };
        status = PaymentStatus.paid;
        await this.pagosRepository.update(identifier, {
          paymentStatus: status,
          stripePaymentIntentId: sess.payment_intent as string,
        });
        break;
      }
      case 'checkout.session.expired': {
        const sess = event.data.object as Stripe.Checkout.Session;
        identifier = { stripeSessionId: sess.id };
        status = PaymentStatus.expired;
        await this.pagosRepository.update(identifier, { paymentStatus: status });
        break;
      }
      // PaymentIntent
      case 'payment_intent.succeeded':
        identifier = { stripePaymentIntentId: (event.data.object as Stripe.PaymentIntent).id };
        status = PaymentStatus.paid;
        await this.pagosRepository.update(identifier, { paymentStatus: status });
        break;
      case 'payment_intent.payment_failed':
        identifier = { stripePaymentIntentId: (event.data.object as Stripe.PaymentIntent).id };
        status = PaymentStatus.failed;
        await this.pagosRepository.update(identifier, { paymentStatus: status });
        break;
      // Cargos y reembolsos
      case 'charge.succeeded':
        identifier = { stripePaymentIntentId: (event.data.object as Stripe.Charge).payment_intent as string };
        status = PaymentStatus.paid;
        await this.pagosRepository.update(identifier, { paymentStatus: status });
        break;
      case 'charge.failed':
        identifier = { stripePaymentIntentId: (event.data.object as Stripe.Charge).payment_intent as string };
        status = PaymentStatus.failed;
        await this.pagosRepository.update(identifier, { paymentStatus: status });
        break;
      case 'charge.refunded':
      case 'refund.created':
        identifier = { stripePaymentIntentId: (event.data.object as Stripe.Charge).payment_intent as string };
        status = PaymentStatus.refunded;
        await this.pagosRepository.update(identifier, { paymentStatus: status });
        break;
      // Disputas
      case 'charge.dispute.created':
        identifier = { stripePaymentIntentId: (event.data.object as Stripe.Dispute).payment_intent as string };
        status = PaymentStatus.dispute_created;
        await this.pagosRepository.update(identifier, { paymentStatus: status });
        break;
      case 'charge.dispute.funds_reinstated':
        identifier = { stripePaymentIntentId: (event.data.object as Stripe.Dispute).payment_intent as string };
        status = PaymentStatus.dispute_won;
        await this.pagosRepository.update(identifier, { paymentStatus: status });
        break;
      case 'charge.dispute.funds_withdrawn':
        identifier = { stripePaymentIntentId: (event.data.object as Stripe.Dispute).payment_intent as string };
        status = PaymentStatus.dispute_lost;
        await this.pagosRepository.update(identifier, { paymentStatus: status });
        break;
    }

    // Actualizar metadatos de evento
    await this.pagosRepository.update(identifier, {
      stripeEventId: event.id,
      lastEventType: event.type,
      lastEventAt: new Date(),
    });

    // Enviar correo si es pago exitoso
    if (status === PaymentStatus.paid) {
      const pago = await this.pagosRepository.findOne({
        where: identifier,
        relations: ['carrito', 'carrito.items', 'carrito.items.product', 'user'],
      });
      this.logger.log(`Email de confirmación enviado para evento ${event.type}`);
    }
  }

  async findAll(query: QueryFilters): Promise<Paginated<Pagos>> {
    const validGroups = Object.keys(statusGroups);
    if (query.statusGroups && validGroups.includes(query.statusGroups)) {
      query = {
        ...query,
        paymentStatus: statusGroups[query.statusGroups],
      };
    }
    return paginateAndFilter(this.repo, query);
  }
}
