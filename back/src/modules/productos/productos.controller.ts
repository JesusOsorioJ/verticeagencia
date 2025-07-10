import { Controller } from '@nestjs/common';
import {
  BaseCrudController,
  CrudControllerOptions,
} from 'src/modules/common/controllers/base-crud.controller';
import { ProductosService } from './productos.service';
import { Productos } from './entities/productos.entity';
import { CreateProductosDto } from './dto/create-productos.dto';
import { UpdateProductosDto } from './dto/update-productos.dto';

const crudOptions: CrudControllerOptions = {};

@Controller('productos')
export class ProductosController extends BaseCrudController(
Productos,
  CreateProductosDto,
  UpdateProductosDto,
  crudOptions
){
  constructor(private readonly productosService: ProductosService) {
    super(productosService);
  }

}
