import 'reflect-metadata';
import * as path from 'path';
import {
  Type,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Controller,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiConsumes,
} from '@nestjs/swagger';
import { ObjectLiteral } from 'typeorm';
import { Paginated } from '../pagination';
import { QueryFilters } from '../types/query.types';
import { BaseService } from '../services/base.service';
import { ByOneQuery, PaginationQuery } from '../decorators/pagination-query.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileStorageService } from 'src/modules/file-storage/file-storage.service';
import { ModuleRef } from '@nestjs/core';

export interface CrudControllerOptions {
  create?: boolean;
  createMany?: boolean;
  findAll?: boolean;
  findOne?: boolean;
  update?: boolean;
  hardDelete?: boolean;
  softDelete?: boolean;
  uploadFile?: boolean;
}

/**
 * Aplica el decorador si `enabled` es true,
 * o un no-op si es false.
 */
function Maybe(decorator: any, enabled: boolean): any {
  return enabled ? decorator : () => { };
}

/**
 * Mixin genérico para CRUD controllers.
 */
export function BaseCrudController<
  Entity extends ObjectLiteral,
  CreateDto,
  UpdateDto,
  ID extends string | number = string
>(
  entityClass: Type<Entity>,
  createDto: Type<CreateDto>,
  updateDto: Type<UpdateDto>,
  options: CrudControllerOptions = {},
): Type<any> {

  const {
    create = true,
    createMany = true,
    findAll = true,
    findOne = true,
    update = true,
    hardDelete = true,
    softDelete = true,
    uploadFile = true
  } = options;

  const entityName = singularize(entityClass.name.toLowerCase());
  const entityNameWithS = pluralize(entityName);

  @Maybe(Controller(entityNameWithS), true)
  @Maybe(ApiTags(entityName.toUpperCase()), true)
  class CrudController {
    @Inject(ModuleRef)
    private readonly moduleRef!: ModuleRef;
    private fileStorageService!: FileStorageService;

    constructor(
      private readonly service: BaseService<Entity, CreateDto, UpdateDto, ID>,
    ) { }

    private getFileStorageService(): FileStorageService {
      if (!this.fileStorageService) {
        this.fileStorageService = this.moduleRef.get(FileStorageService, {
          strict: false,
        });
      }
      return this.fileStorageService;
    }

    // CREATE
    @Maybe(Post(), create)
    @Maybe(ByOneQuery(entityClass), create)
    @Maybe(ApiOperation({ summary: `Crear un nuevo ${entityName}` }), create)
    @Maybe(ApiBody({ type: createDto }), create)
    @Maybe(ApiResponse({ status: 201, description: `${capitalize(entityName)} creado exitosamente` }), create)
    async create(@Body() dto: CreateDto, @Query('relations') relationsQuery?: string) {
      const create = await this.service.create(dto);
      const id = this.service.getPrimaryKey();
      const relations = this.service.parseRelationsQuery(relationsQuery);
      return this.service.findOne(create[id], { relations });
    }

    // FIND ALL
    @Maybe(Get(), findAll)
    @Maybe(PaginationQuery(entityClass), findAll)
    @Maybe(ApiOperation({ summary: `Listar todos los ${entityNameWithS}` }), findAll)
    @Maybe(ApiResponse({ status: 200, description: `Listado de ${entityNameWithS}` }), findAll)
    findAll(@Query() query: QueryFilters): Promise<Paginated<Entity>> {
      return this.service.findAll(query);
    }

    // FIND ONE
    @Maybe(Get(':id'), findOne)
    @Maybe(ByOneQuery(entityClass), findOne)
    @Maybe(ApiOperation({ summary: `Obtener un ${entityName} por ID (primary key)` }), findOne)
    @Maybe(ApiResponse({ status: 200, description: `${capitalize(entityName)} encontrado` }), findOne)
    @Maybe(ApiResponse({ status: 404, description: `${capitalize(entityName)} no encontrado` }), findOne)
    @Maybe(ApiParam({ name: 'id', description: `ID de ${entityName}`, type: 'string' }), findOne)
    findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: ID, @Query('relations') relationsQuery?: string) {
      const relations = this.service.parseRelationsQuery(relationsQuery);
      return this.service.findOne(id, { relations });
    }

    // UPDATE
    @Maybe(Patch(':id'), update)
    @Maybe(ByOneQuery(entityClass), update)
    @Maybe(ApiOperation({ summary: `Actualizar un ${entityName} por ID (primary key)` }), update)
    @Maybe(ApiBody({ type: updateDto }), update)
    @Maybe(ApiResponse({ status: 200, description: `${capitalize(entityName)} actualizado` }), update)
    @Maybe(ApiResponse({ status: 404, description: `${capitalize(entityName)} no encontrado` }), findOne)
    @Maybe(ApiParam({ name: 'id', description: `ID de ${entityName}`, type: 'string' }), findOne)
    async update(@Param('id', new ParseUUIDPipe({ version: '4' })) id: ID, @Body() dto: UpdateDto, @Query('relations') relationsQuery?: string) {
      await this.service.update(id, dto);
      const relations = this.service.parseRelationsQuery(relationsQuery);
      return this.service.findOne(id, { relations });
    }

    // HARD DELETE
    @Maybe(Delete('hardDelete/:id'), hardDelete)
    @Maybe(ApiOperation({ summary: `Eliminar un ${entityName} (Hard delete) por ID (primary key)` }), hardDelete)
    @Maybe(ApiResponse({ status: 200, description: `${capitalize(entityName)} eliminado` }), hardDelete)
    @Maybe(ApiResponse({ status: 404, description: `${capitalize(entityName)} no encontrado` }), findOne)
    @Maybe(ApiParam({ name: 'id', description: `ID de ${entityName}`, type: 'string' }), findOne)
    hardDelete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: ID) {
      return this.service.hardDelete(id);
    }

    // UPLOAD FILE
    @Maybe(Patch('uploadFile/:fieldName/:id'), uploadFile)
    @Maybe(ApiOperation({ summary: 'Subir un archivo al campo {fieldName} y registro indicado {id}.' }), uploadFile)
    @Maybe(ApiConsumes('multipart/form-data'), uploadFile)
    @Maybe(ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary', description: 'Archivo que se desea subir' } }, required: ['file'] } }), uploadFile,)
    @Maybe(ApiResponse({ status: 201, description: 'Archivo subido exitosamente' }), uploadFile,)
    @Maybe(ApiResponse({ status: 400, description: 'No se proporcionó ningún archivo', }), uploadFile,)
    @Maybe(ApiResponse({ status: 404, description: `${capitalize(entityName)} no encontrado`, }), uploadFile,)
    @Maybe(ApiParam({ name: 'id', description: `ID de ${entityName}`, type: 'string', }), findOne,)
    @Maybe(ApiParam({ name: 'fieldName', description: `Campo de ${entityName} para subir archivo`, type: 'string', }), uploadFile,)
    @Maybe(UseInterceptors(FileInterceptor('file')), uploadFile)
    async uploadFile(@Param('id', new ParseUUIDPipe({ version: '4' })) id: ID, @Param('fieldName') fieldName: string, @UploadedFile() file: any,): Promise<Entity | null> {
      if (!file) { throw new BadRequestException('No file uploaded') }
      await this.service.findOne(id);
      this.service.findRelationWithPropertyPath(fieldName);

      const mimetype = path.extname(file.originalname).slice(1) || 'application/octet-stream'
      const fileStorageService = this.getFileStorageService();
      const fileMeta = await fileStorageService.create({
        fieldname: file.fieldname,
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype,
        size: file.size
      });
      const name = `${fileMeta.clavePrincipal}.${mimetype}`
      await fileStorageService.upload(file.buffer, { filename: name });
      
      // 5) Update entity con el ID del archivo
      return await this.service.update(id, {
        [fieldName]: fileMeta.clavePrincipal,
      } as unknown as UpdateDto);
    }
  }

  // Reinyecta metadata de DTOs para create/update
  if (create) applyDtoMetadata(CrudController, 'create', createDto);
  if (update) applyDtoMetadata(CrudController, 'update', updateDto);

  return CrudController;
}


/**
 * Funcion para capitalizar la primera letra de una cadena.
 *
 * @param entityClass Palabra clave de la entidad (p.ej. Productos).
 * * @returns Palabra capitalizada.
 */
function capitalize(str: string): string {
  if (!str) return '';
  return str[0].toUpperCase() + str.slice(1);
}

/**
 * Si la palabra termina en 's' o 'S', la elimina.
 * @param word Texto de entrada.
 * @returns Texto sin la 's' final.
 */
function singularize(word: string): string {
  return word
    .replace(/crud/i, '')
    .replace(/s$/i, '');
}

/**
 * Si la palabra no termina en 's' o 'S', la agrega.
 * @param word Texto de entrada.
 * @returns Texto con una 's' final si no la tenía.
 */
function pluralize(word: string): string {
  return word + 's';
}

// ---------------------
// Helper para reinyectar metadata
// ---------------------
/**
 * Fuerza la metadata de paramtypes para que Nest conozca el DTO real.
 * @param controller  Clase del controlador
 * @param methodName  Nombre del método (e.g. 'create')
 * @param dto         Clase del DTO (e.g. CreateProductosDto)
 */
function applyDtoMetadata(
  controller: Function,
  methodName: string,
  dto: Function,
) {
  Reflect.defineMetadata(
    'design:paramtypes',
    [dto],
    controller.prototype,
    methodName,
  );
}


