import { Body, Controller, Get, Header, Post, Req, Res } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreatePagoDto } from './dto/createPago.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { Pagos } from './entities/pagos.entity';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import {
  BaseCrudController,
  CrudControllerOptions,
} from 'src/modules/common/controllers/base-crud.controller';
import { UpdatePagoDto } from './dto/updatePago.dto';

const crudOptions: CrudControllerOptions = {
  create: false,
};

@Controller('pagos')
export class PagosController extends BaseCrudController(
  Pagos,
  CreatePagoDto,
  UpdatePagoDto,
  crudOptions,
) {
  constructor(private readonly pagosService: PagosService) {
    super(pagosService);
  }

  @Post('create-payment-session')
  @ApiOperation({ summary: 'Crear sesión de pago único *' })
  async createPaymentSession(
    @GetUser() user: Usuarios,
    @Body() dto: CreatePagoDto,
  ) {
    return this.pagosService.createPaymentSession(user, dto);
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Webhook de Stripe para actualización de estados de pago' })
  @Header('content-type', 'application/json')
  async webhook(@Req() req: any, @Res() res: any) {
   try {
    await this.pagosService.handleWebhook(
      req.headers['stripe-signature'],
      req.rawBody
    );
    return res.status(200).send({ received: true });
    } catch (err:any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

}
