import { PartialType } from '@nestjs/swagger';
import { CreatePagoDto } from './createPago.dto';

export class UpdatePagoDto extends PartialType(CreatePagoDto) {}