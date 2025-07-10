import { IsOptional } from "class-validator";
import { PaymentStatus } from "../interfaces/iPagos";
import { CreateBaseDto } from "src/modules/common/dto/create-base.dto";

export class SearchPagosDto extends CreateBaseDto {
    @IsOptional()
    username?: string;

    @IsOptional()
    status?: PaymentStatus;
}