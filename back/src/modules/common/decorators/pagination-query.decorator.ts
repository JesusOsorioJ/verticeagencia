import { applyDecorators, Type } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { getMetadataArgsStorage } from 'typeorm';

/**
 * Genera automáticamente parámetros de consulta para paginación, ordenamiento,
 * filtros por columnas (propias + heredadas) y filtros por campos de entidades relacionadas.
 *
 * @param entity Entidad de TypeORM sobre la que se generarán los parámetros
 */
export function PaginationQuery<T>(entity: Type<T>) {
  const storage = getMetadataArgsStorage();

  const targets: Function[] = [];
  let current: any = entity;
  while (current && current !== Object) {
    targets.push(current);
    current = Object.getPrototypeOf(current.prototype)?.constructor;
  }

  const columns = storage.columns
    .filter(col => targets.includes(col.target as Function))
    .map(col => col.propertyName);

  const relations = storage.relations
    .filter(rel => rel.target === entity)
    .map(rel => ({
      propertyName: rel.propertyName,
      type: rel.type,
    }));

  const relationNames: string[] = relations.map(rel => rel.propertyName);

  const decorators = [];

  decorators.push(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Número de página (default = 1)',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Cantidad de items por página (default = 10)',
    }),
    ApiQuery({
      name: 'sortBy',
      required: false,
      type: String,
      description: 'Campo por el cual ordenar.',
    }),
    ApiQuery({
      name: 'order',
      required: false,
      enum: ['ASC', 'DESC'],
      description: 'Orden de los resultados: ASC o DESC.',
    }),
    ApiQuery({
      name: 'relations',
      required: false,
      type: String,
      description: 
        `Popular las relaciones de la tabla? "true" para todas o array de relaciones requeridas. 
        Relaciones válidas: [${relationNames.join(',')}].`,
    }),
  );

  // Filtros por columnas (propias + heredadas)
  columns.forEach(col => {
    decorators.push(
      ApiQuery({
        name: col,
        required: false,
        description: `Filtrar por ${col} (LIKE)`,
      }),
      ApiQuery({
        name: `${col}From`,
        required: false,
        description: `Valor mínimo para ${col}`,
      }),
      ApiQuery({
        name: `${col}To`,
        required: false,
        description: `Valor máximo para ${col}`,
      }),
    );
  });

   // Relaciones
  relations.forEach((rel: any) => {
    const relatedEntity =
      typeof rel.type === 'function' ? rel.type() : rel.type;
    const relatedCols = storage.columns
      .filter((col) => col.target === relatedEntity)
      .map((col) => col.propertyName);

    relatedCols.forEach((prop) =>
      decorators.push(
        ApiQuery({
          name: `${rel.propertyName}.${prop}`,
          required: false,
          description: `Filtrar por ${rel.propertyName}.${prop} (LIKE)`,
        }),
      ),
    );
  });

  return applyDecorators(...decorators);
}


/**
 * @param entity Entidad de TypeORM sobre la que se generarán los parámetros
 */
export function ByOneQuery<T>(entity: Type<T>) {
  const storage = getMetadataArgsStorage();
  const relations = storage.relations
    .filter(rel => rel.target === entity)
    .map(rel => ({
      propertyName: rel.propertyName,
      type: rel.type,
    }));

  const relationNames: string[] = relations.map(rel => rel.propertyName);
  const decorators = [];

  decorators.push(
    ApiQuery({
      name: 'relations',
      required: false,
      type: String,
      description: 
        `Popular las relaciones de la tabla? "true" para todas o array de relaciones requeridas. 
        Relaciones válidas: [${relationNames.join(',')}].`,
    }),
  );

  return applyDecorators(...decorators);
}
