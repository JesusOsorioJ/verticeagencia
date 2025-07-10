import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import {
  CreateUsuariosDto,
} from './dto/create-usuarios.dto';
import { UpdateUsuariosDto } from './dto/update-usuarios.dto';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { Usuarios } from './entities/usuarios.entity';
import { BaseCrudController, CrudControllerOptions } from 'src/modules/common/controllers/base-crud.controller';
import { FileStorageService } from '../file-storage/file-storage.service';

const crudOptions: CrudControllerOptions = {
  hardDelete: false,
  uploadFile: false
};

@Controller('users')
export class UsersController extends BaseCrudController(
  Usuarios,
  CreateUsuariosDto,
  UpdateUsuariosDto,
  crudOptions
) {
  constructor(
    private readonly userService: UsuariosService,
    private readonly fileStorageService: FileStorageService
  ) {
    super(userService);
  }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  create(@Body() dto: CreateUsuariosDto) {
    return this.userService.create(dto);
  }
  
}
