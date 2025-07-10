import { Module } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { PagosController } from './pagos.controller';
import { Pagos } from './entities/pagos.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from 'src/modules/usuarios/usuarios.module';
import { Carrito } from 'src/modules/carrito/entities/carrito.entity';
import { CarritoItem } from 'src/modules/carrito/entities/carrito-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pagos, Carrito, CarritoItem]), UsuariosModule ],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}
