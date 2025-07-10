import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateBaseDto } from 'src/modules/common/dto/create-base.dto';

export class LoginDto extends CreateBaseDto {
  @ApiProperty({ example: 'Email'})
  @IsString()
  @IsNotEmpty()
  identifier!: string;

  @ApiProperty({ example: 'Usuario contraseña ******' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}