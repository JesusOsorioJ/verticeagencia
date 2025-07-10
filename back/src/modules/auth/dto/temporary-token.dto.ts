import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { CreateBaseDto } from 'src/modules/common/dto/create-base.dto';

export class TemporaryTokenDto extends CreateBaseDto {
  @ApiPropertyOptional({example: 'Tiempo de expiración del token (ej: "1h", "30m").'})
  @IsString()
  @IsOptional()
  expiresIn?: string;
}
