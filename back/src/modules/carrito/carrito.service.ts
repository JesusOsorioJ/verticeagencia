import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Carrito } from './entities/carrito.entity';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/modules/common/services/base.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { CarritoItem } from './entities/carrito-items.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Productos } from '../productos/entities/productos.entity';
import { Pagos } from '../pagos/entities/pagos.entity';

export type CarritoConRelaciones = Carrito & {
  items: (CarritoItem & { product: Productos })[];
  user?: Usuarios;
  payment?: Pagos;
};

@Injectable()
export class CarritoService extends BaseService<
  Carrito,
  CreateCarritoDto,
  UpdateCarritoDto
> {
  constructor(
    @InjectRepository(CarritoItem)
    private carritoItemRepository: Repository<CarritoItem>,
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
    @InjectRepository(Productos)
    private productosRepository: Repository<Productos>,
  ) {
    super(carritoRepository);
  }

  /**
   * Retorna el carrito activo de un usuario o crea uno nuevo.
   */
  async getActiveCart(userId: string): Promise<Carrito> {
    let cart =  await this.carritoRepository.findOne({
      where: { userId, paymentId: IsNull() },
      relations: ['items', 'items.product', 'items.product.image_1', 'payment', 'user', ],
      order: { createdAt: 'DESC' },
    })

    if (!cart) {
      cart = this.carritoRepository.create({ userId, items: [] });
      await this.carritoRepository.save(cart);
    }

    return cart;
  }

  /**
 * Agrega o remueve ítems del carrito según cantidad. Crea carrito si no existe.
 */
  async modifyItem(
    dto: UpdateCarritoDto,
    reqUser: Usuarios,
  ): Promise<{ cart: Carrito; totalItems: number; totalAmount: number }> {
    const userId = reqUser.id;
    const { productId, quantity = 1 } = dto;
    let cart = await this.getActiveCart(userId!);

    // Si no viene productId, solo calcular totales y devolver
    if (!productId) {
      const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      const totalAmount = cart.items.reduce(
        (sum, i) => sum + Number(i.product.price) * i.quantity,
        0,
      );
      return { cart, totalItems, totalAmount };
    }

    // Intentar encontrar o crear el item
    let item = cart.items.find((i) => i.productId === productId);

    if (!item) {
      if (quantity <= 0) {
        throw new NotFoundException('Item no existe en el carrito');
      }

      const producto = await this.productosRepository.findOne({ where: { id: productId } });
      if (!producto) {
        throw new BadRequestException('No se pudo añadir elemento al carrito');
      }

      item = this.carritoItemRepository.create({
        cartId: cart.id,
        productId,
        quantity,
      });
      cart.items.push(item);
    } else {
      item.quantity += quantity;
      if (item.quantity <= 0) {
        await this.carritoItemRepository.delete(item.id);
        cart.items = cart.items.filter((i) => i.id !== item!.id);
      } else {
        await this.carritoItemRepository.save(item);
      }
    }

    await this.carritoRepository.save(cart);
    cart = await this.getActiveCart(userId!);

    const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalAmount = cart.items.reduce(
      (sum, i) => sum + Number(i.product.price) * i.quantity,
      0,
    );

    return { cart, totalItems, totalAmount };
  }
}
