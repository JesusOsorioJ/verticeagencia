import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { Productos } from './entities/productos.entity';
import { ProductosController } from './productos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Productos]) ],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
