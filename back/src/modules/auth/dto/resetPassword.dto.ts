import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBaseDto } from 'src/modules/common/dto/create-base.dto';

export class ResetPasswordDto extends CreateBaseDto {
  @ApiProperty({ example: 'Token para cambio de contraseña' })
  @IsString()
  @IsNotEmpty()
  token!: string;

  @ApiProperty({ example: 'Nueva contraseña *******' })
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}