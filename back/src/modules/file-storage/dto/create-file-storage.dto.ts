import { IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateBaseDto } from 'src/modules/common/dto/create-base.dto';

export class CreateFileStorageDto extends CreateBaseDto {
  @ApiPropertyOptional()
  @IsOptional()
  provider?: "local" | "s3";

  @ApiPropertyOptional()
  @IsOptional()
  fieldname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  originalname?: string;

  @ApiPropertyOptional()
  @IsOptional()
  encoding?: string;

  @ApiPropertyOptional()
  @IsOptional()
  mimetype?: string;

  @ApiPropertyOptional()
  @IsOptional()
  size?: number;
}
