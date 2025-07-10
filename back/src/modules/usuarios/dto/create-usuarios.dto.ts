import { IsString, IsNotEmpty, IsEmail, IsEnum, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleStatus } from 'src/modules/usuarios/entities/usuarios.entity';
import { CreateBaseDto } from 'src/modules/common/dto/create-base.dto';

export class CreateUsuariosDto extends CreateBaseDto {
  @ApiPropertyOptional({ example: 'UUID del usuario a actualizar (solo {admin}). Ignorado si el rol no es {admin}.'})
  @IsUUID()
  @IsOptional()
  id?: RoleStatus;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;
}


export class UpdatePasswordDto extends CreateBaseDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword!: string;
}
