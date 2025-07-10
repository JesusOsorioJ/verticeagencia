import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTable } from 'src/modules/common/entities/base.entity';
import { PagosType, PaymentStatus } from '../interfaces/iPagos';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Carrito } from 'src/modules/carrito/entities/carrito.entity';

@Entity()
export class Pagos extends BaseTable {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  clavePrincipal!: string;

  @ApiProperty()
  @Column({ type: 'enum', enum: PagosType, nullable : true })
  type?: PagosType;

  @ApiProperty()
  @Column({ name: 'stripe_session_id', nullable: true })
  stripeSessionId?: string;

  @Column({ 
    name: 'stripe_payment_intent_id', 
    nullable: true 
  })
  stripePaymentIntentId?: string;

  @Column({ nullable: true })
  stripeEventId?: string;     

  @ApiProperty()
  @Column({nullable: false})
  paymentMethod!: string;

  @ApiProperty()
  @Column({nullable: false})
  paymentAmount!: number;

  @ApiProperty()
  @Column({nullable: false})
  paymentDate!: Date;

  @ApiProperty()
  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus!: PaymentStatus;

  @Column({ nullable: true }) 
  lastEventType?: string;

  @Column({ type: 'timestamp', nullable: true }) 
  lastEventAt?: Date;

  @Column({ type: 'json', nullable: true }) 
  metadata?: any;

  @Column({ type: 'varchar', length: 255, nullable: true }) 
  description?: string;

  @ApiProperty({ type: () => Usuarios })
  @ManyToOne(() => Usuarios, user => user.pagos, { eager: true })
  @JoinColumn({ name: 'userId' })
  user!: Usuarios;

  @ApiProperty()
  @Column({nullable: true})
  userId?: string | null; 

  @ApiProperty({ type: () => Carrito, description: 'Carrito vinculado al pago' })
  @OneToOne(() => Carrito, carrito => carrito.payment, { cascade: true,  onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carritoId' })
  carrito?: Carrito;

  @ApiProperty()
  @Column({ type: 'uuid', nullable: true })
  carritoId?: string | null;
}