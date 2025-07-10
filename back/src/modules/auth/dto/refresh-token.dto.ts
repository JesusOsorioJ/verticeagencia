import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { CreateBaseDto } from 'src/modules/common/dto/create-base.dto';

export class RefreshTokenDto extends CreateBaseDto {
  @ApiProperty({ example: 'Refresh token válido' })
  @IsString()
  @IsNotEmpty()
  refresh_token!: string;
}
