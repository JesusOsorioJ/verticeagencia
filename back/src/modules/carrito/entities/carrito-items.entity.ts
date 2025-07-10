import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Carrito } from './carrito.entity';
import { Productos } from 'src/modules/productos/entities/productos.entity';

@Entity('cart_items')
export class CarritoItem {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @ManyToOne(() => Carrito, (cart) => cart.items, { onDelete: 'CASCADE'})
  @JoinColumn({ name: 'cartId' })
  cart!: Carrito;

  @ApiProperty()
  @Column({ nullable: false })
  cartId!: string;

  @ApiProperty()
  @ManyToOne(() => Productos)
  @JoinColumn({ name: 'productId' })
  product!: Productos;

  @ApiProperty()
  @Column({ nullable: false })
  productId!: string;

  @ApiProperty()
  @Column({ type: 'int', default: 1 })
  quantity!: number;
}