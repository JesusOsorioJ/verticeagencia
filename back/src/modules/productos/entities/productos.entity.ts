import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseTable } from 'src/modules/common/entities/base.entity';
import { Filestorage } from 'src/modules/file-storage/entities/filestorage.entity';

@Entity('products')
export class Productos extends BaseTable {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column({ nullable: false })
  title!: string;

  @ApiProperty()
  @Column({ nullable: false })
  marca!: string;

  @ApiProperty({ description: 'Descripción opcional del producto' })
  @Column({ nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price!: number;

  @ManyToOne(() => Filestorage, (filestorage) => filestorage.imagedata1)
  @JoinColumn({ name: 'image1' })
  image_1?: Filestorage;

  @ApiProperty()
  @Column({ nullable: true })
  image1?: string;

  @ManyToOne(() => Filestorage, (filestorage) => filestorage.imagedata2)
  @JoinColumn({ name: 'image2' })
  image_2?: Filestorage;

  @ApiProperty()
  @Column({ nullable: true })
  image2?: string;

  @ManyToOne(() => Filestorage, (filestorage) => filestorage.imagedata3)
  @JoinColumn({ name: 'image3' })
  image_3?: Filestorage;

  @ApiProperty()
  @Column({ nullable: true })
  image3?: string;

}


