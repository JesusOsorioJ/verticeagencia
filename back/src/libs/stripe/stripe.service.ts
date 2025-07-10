import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Stripe from 'stripe';
import config from 'src/config/config';
import { CarritoConRelaciones } from 'src/modules/carrito/carrito.service';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly webHookSecret: string;

  constructor(
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
  ) {
    this.stripe = new Stripe(this.configService.stripe.STRIPE_SECRET_KEY, {
      apiVersion: '2025-04-30.basil',
    });

    this.webHookSecret = this.configService.stripe.STRIPE_WEBHOOK_SECRET;
  }

  async createCheckoutSession(
    user: Usuarios,
    cart: CarritoConRelaciones
  ): Promise<any> {
    // Prepara la lista de items
    const lineItems = cart.items.map((item:any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title.toUpperCase(),
          description: item.product.description,
          images: [
            'https://cdn-icons-png.flaticon.com/512/11873/11873385.png',
          ],
        },
        unit_amount: Math.round(Number(item.product.price) * 100),
      },
      quantity: item.quantity,
    }));

    // **2. Crea la sesión**
    const session = await this.stripe.checkout.sessions.create({
      // Payment methods
      payment_method_types: ['card', 'us_bank_account'],
      // Mostrar “Add promotion code”
      allow_promotion_codes: true,
      // Precargar email y referencia interna
      customer_email: user.email,
      client_reference_id: cart.id,
      // Datos de envío (si tienes productos físicos)
      // shipping_address_collection: {
      //   allowed_countries: ['US', 'CA'],
      // },
      // Recolección de teléfono
      phone_number_collection: { enabled: true },
      // Localización (idioma)
      locale: 'es',
      // Impuestos automáticos (requiere configurar en Dashboard)
      automatic_tax: { enabled: true },
      // Línea de detalle
      line_items: lineItems,
      // Modo de pago
      mode: 'payment',
      // Descriptor en el estado de cuenta
      payment_intent_data: {
        statement_descriptor: 'TU EMPRESA',
        // setup_future_usage: 'off_session', // si quieres guardar tarjeta
      },
      // URLs de éxito y cancelación
      success_url: `${this.configService.url.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.url.FRONTEND_URL}/cancel`,
      // Metadatos para tu reconciliación
      metadata: {
        userId: user.id,
        cartId: cart.id
      },
    });

    return session;
  }

  /**
   * Verifica la firma y devuelve el evento Stripe.
   * @param signature Cabecera 'stripe-signature'
   * @param payload Buffer con el rawBody
   */
  verifyWebhookSignature(signature: string, payload: Buffer): Stripe.Event {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webHookSecret,
      );
    } catch (err: any) {
      throw new NotFoundException(
        `Webhook signature verification failed: ${err.message}`,
      );
    }
  }
}
