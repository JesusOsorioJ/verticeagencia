import { Injectable } from '@nestjs/common';
import { Productos } from './entities/productos.entity';
import { UpdateProductosDto } from './dto/update-productos.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/modules/common/services/base.service';
import { CreateProductosDto } from './dto/create-productos.dto';

@Injectable()
export class ProductosService extends BaseService<
  Productos,
  CreateProductosDto,
  UpdateProductosDto
> {
  constructor(
    @InjectRepository(Productos)
    private productosRepository: Repository<Productos>,
  ) {
    super(productosRepository);
  }
}
