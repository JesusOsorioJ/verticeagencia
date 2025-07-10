import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTable } from 'src/modules/common/entities/base.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { Productos } from 'src/modules/productos/entities/productos.entity';

@Entity()
export class Filestorage extends BaseTable {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  clavePrincipal?: string;

  @ApiProperty()
  @Column({ nullable: true, default: "local" })
  provider?: "local" | "s3";

  @ApiProperty()
  @Column({ nullable: true })
  fieldname?: string;

  @ApiProperty()
  @Column({ nullable: true })
  originalname?: string;

  @ApiProperty()
  @Column({ nullable: true })
  encoding?: string;

  @ApiProperty()
  @Column({ nullable: true })
  mimetype?: string;

  @ApiProperty()
  @Column({ nullable: true })
  size?: number;

  @OneToMany(() => Productos, products => products.image_1)
  imagedata1?: Productos[];

  @OneToMany(() => Productos, products => products.image_2)
  imagedata2?: Productos[];

  @OneToMany(() => Productos, products => products.image_3)
  imagedata3?: Productos[];
}
