import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoSeeding } from './seeders/product.seed';
import { Productos } from 'src/modules/productos/entities/productos.entity';
import { Filestorage } from 'src/modules/file-storage/entities/filestorage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Productos,Filestorage])],
  providers: [ProductoSeeding],
  exports: [ProductoSeeding],
})
export class SeedingModule {}