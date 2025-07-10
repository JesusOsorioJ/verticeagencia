import {
  Controller,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import {  ApiOperation } from '@nestjs/swagger';
import { CarritoService } from './carrito.service';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';
import { GetUser } from 'src/modules/auth/decorators/get-user.decorator';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { Carrito } from './entities/carrito.entity';
import { BaseCrudController, CrudControllerOptions } from 'src/modules/common/controllers/base-crud.controller';
import { UpdateCarritoDto } from './dto/update-carrito.dto';


@Controller('carrito')
export class CarritoController extends BaseCrudController(
  Carrito,
  CreateCarritoDto,
  UpdateCarritoDto
){
  constructor(private readonly carritoService: CarritoService) {
    super(carritoService);
  }
  @ApiOperation({ summary: 'Agregar o quitar productos del carrito (token) o obtener carrito con body vacio *' })
  @Post()
  create(@Body() dto: CreateCarritoDto, @GetUser() user: Usuarios) {
    return this.carritoService.modifyItem(dto, user);
  }

   @ApiOperation({ summary: 'Agregar o quitar productos del carrito (token) o obtener carrito con body vacio *' })
  @Get("/getActiveCart")
  get(@GetUser() user: Usuarios) {
    return this.carritoService.getActiveCart(user.id);
  }
  
}
