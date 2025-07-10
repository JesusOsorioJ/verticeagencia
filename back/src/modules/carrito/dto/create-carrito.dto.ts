import { IsUUID, IsInt, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBaseDto } from 'src/modules/common/dto/create-base.dto';

export class CreateCarritoDto extends CreateBaseDto {
  @ApiPropertyOptional({ example: 'ID del producto' })
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({ example: 'Cantidad a agregar (positivo) o remover (negativo)' })
  @IsInt()
  @IsOptional()
  quantity?: number;
}
