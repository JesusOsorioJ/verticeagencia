import { PartialType } from '@nestjs/swagger';
import { CreateProductosDto } from './create-productos.dto';

export class UpdateProductosDto extends PartialType(CreateProductosDto) {}