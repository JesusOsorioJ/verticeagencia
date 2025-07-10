import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CarritoItem } from './carrito-items.entity';
import { BaseTable } from 'src/modules/common/entities/base.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Pagos } from 'src/modules/pagos/entities/pagos.entity';

@Entity('carts')
export class Carrito extends BaseTable {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Usuario propietario del carrito' })
  @ManyToOne(() => Usuarios, (user) => user.carritos)
  @JoinColumn({ name: 'userId' })
  user!: Usuarios;

  @ApiProperty()
  @Column({ nullable: false })
  userId!: string;

  @OneToMany(() => CarritoItem, (item) => item.cart, {
    cascade: ['insert', 'update', 'remove'],
    eager: true,
  })
  items!: CarritoItem[];

  @ApiProperty({ type: () => Pagos, description: 'Pago asociado al carrito' })
  @OneToOne(() => Pagos, (pago) => pago.carrito, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'paymentId' })
  payment?: Pagos;

  @Column({ type: 'uuid', nullable: true })
  paymentId?: string;
}
