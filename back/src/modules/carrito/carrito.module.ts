import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoService } from './carrito.service';
import { Carrito } from './entities/carrito.entity';
import { CarritoController } from './carrito.controller';
import { CarritoItem } from './entities/carrito-items.entity';
import { Productos } from '../productos/entities/productos.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carrito, CarritoItem, Productos]) ],
  controllers: [CarritoController],
  providers: [CarritoService],
  exports: [CarritoService],
})
export class CarritoModule {}
