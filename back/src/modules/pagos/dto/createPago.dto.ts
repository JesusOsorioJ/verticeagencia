import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { CreateBaseDto } from 'src/modules/common/dto/create-base.dto';

export class CreatePagoDto extends CreateBaseDto {
  @ApiPropertyOptional({ example: 'Monto de donacion (USD), si no se envia se busca un carrito activo por el token' })
  @IsNumber()
  @IsOptional()
  donacion?: number;
}