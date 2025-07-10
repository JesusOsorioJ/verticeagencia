import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTable } from 'src/modules/common/entities/base.entity';
import { Pagos } from 'src/modules/pagos/entities/pagos.entity';
import { Carrito } from 'src/modules/carrito/entities/carrito.entity';

export enum RoleStatus {
  admin = 'admin',
  user = 'user',
  reviewer = 'reviewer',
}

@Entity()
export class Usuarios extends BaseTable {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column({ nullable: false })
  email!: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.user })
  rol!: RoleStatus;

  @ApiProperty()
  @Column({nullable: false, select: false })
  password!: string;

  @OneToMany(() => Pagos, pago => pago.user)
  pagos!: Pagos[];

  @OneToMany(() => Carrito, cart => cart.user)
  carritos!: Carrito[];
}