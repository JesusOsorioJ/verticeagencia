import { Controller, Get, NotFoundException, Param, Query, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { FileStorageService } from './file-storage.service';
import { Filestorage } from './entities/filestorage.entity';
import { BaseCrudController, CrudControllerOptions } from '../common/controllers/base-crud.controller';
import { CreateFileStorageDto } from './dto/create-file-storage.dto';
import { UpdateFileStorageDto } from './dto/update-file-storage.dto';
import { join } from 'path';
import { existsSync } from 'fs';
import { Public } from '../auth/decorators/public.decorator';
import { JwtService } from 'src/libs/jwt/jwt.service';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

const crudOptions: CrudControllerOptions = {
  create: false,
  createMany: false,
  update: false,
  findOne: false,
  softDelete: false,
  hardDelete: false,
  uploadFile: false
};


@Controller('files')
export class FileStorageController extends BaseCrudController(
  Filestorage,
  CreateFileStorageDto,
  UpdateFileStorageDto,
  crudOptions
) {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private jwtService: JwtService
  ) {
    super(fileStorageService);
  }
  // añadir o rescribir (override) metodo si es necesario

  @Get('/:filename')
  @Public()
  @ApiOperation({ summary: 'Servir un archivo estático protegido por token' })
  @ApiParam({ name: 'filename', type: 'string', description: 'Nombre del archivo ubicado en la carpeta uploads' })
  @ApiQuery({ name: 'token', type: 'string', required: true, description: 'JWT en query-param para autorizar la descarga del archivo' })
  @ApiResponse({ status: 200, description: 'Archivo encontrado y enviado correctamente', })
  @ApiResponse({ status: 401, description: 'Token inválido o no proporcionado' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado' })
  async serveFile(@Param('filename') filename: string, @Query('token') token: string, @Res({ passthrough: false }) res: Response,
  ) {
    if (!token) {
      throw new UnauthorizedException('Añadir token a query-param');
    }
    this.jwtService.verify(token);

    const filePath = join(process.cwd(), 'uploads', filename);
    if (!existsSync(filePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    return res.sendFile(filePath);
  }
}
