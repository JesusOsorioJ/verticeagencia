import { Repository, ObjectLiteral } from 'typeorm';
import { QueryFilters } from './types/query.types';

/**
 * Resultado paginado genérico
 */
export interface Paginated<T> {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  data: T[];
}

/**
 * Paginación, ordenación y filtrado genérico para un repositorio TypeORM.
 *
 * Características:
 * - Soporta relaciones con notación de puntos (ej: 'relacion.campo').
 * - Búsqueda por LIKE en cualquier campo (convierte a texto internamente).
 * - Filtrado por rangos usando sufijos 'CampoFrom' y 'CampoTo'.
 * - Ordenación mediante parámetros 'sortBy' y 'order'.
 * - Si no se especifica `searchableFields`, usa todos los campos de la entidad.
 *
 * @template T  Entidad de la que se crea el repositorio (extiende ObjectLiteral).
 * @param repo            Repositorio de TypeORM de la entidad.
 * @param query           Objeto con parámetros de consulta (page, limit, filtros, sortBy, order).
 * @returns               Objeto con totalItems, totalPages y la página de datos solicitada.
 */
export async function paginateAndFilter<T extends ObjectLiteral>(
  repo: Repository<T>,
  query: QueryFilters & { relations?: string },
): Promise<Paginated<T>> {
  const alias = repo.metadata.tableName;

  const {
    page = 1,
    limit = 10,
    sortBy,
    order = 'ASC',
    relations: relationsQuery = 'false',
    ...filters
  } = query;

  // Determinar lista de relaciones a unir
  const allRels = repo.metadata.relations.map((r) => r.propertyName);
  let relsToJoin: string[];
  const parsedArray = JSON.parse(relationsQuery);
  if (Array.isArray(parsedArray)) {
    relsToJoin = parsedArray.filter((r) => allRels.includes(r));
  } else if (relationsQuery === 'true') {
    relsToJoin = allRels;
  } else {
    relsToJoin = [];
  }

  const qb = repo.createQueryBuilder(alias);

  // Unir relaciones
  relsToJoin.forEach((rel) => {
    qb.leftJoinAndSelect(`${alias}.${rel}`, rel);
  });

  // Aplicar filtros
  Object.entries(filters).forEach(([key, val]) => {
    if (val === undefined) return;

    // Rango: CampoFrom / CampoTo
    const rangeMatch = key.match(/(.+)(From|To)$/);
    if (rangeMatch) {
      const [, raw, dir] = rangeMatch;
      const colMeta = repo.metadata.findColumnWithPropertyName(raw);
      if (!colMeta) return;
      const dbCol = colMeta.databaseName;
      const operator = dir === 'From' ? '>=' : '<=';
      qb.andWhere(`${alias}."${dbCol}" ${operator} :${key}`, { [key]: val });
      return;
    }

    // Filtros por relación: notación "relacion.campo"
    if (key.includes('.')) {
      const [relName, field] = key.split('.');
      const relMeta = repo.metadata.findRelationWithPropertyPath(relName);
      if (!relMeta) return;

      // Unir si no estaba en relsToJoin
      if (!relsToJoin.includes(relName)) {
        qb.leftJoinAndSelect(`${alias}.${relName}`, relName);
        relsToJoin.push(relName);
      }
      const col =
        relMeta.inverseEntityMetadata.findColumnWithPropertyName(field);
      if (!col) return;
      const paramName = `${relName}_${field}`;

      if (Array.isArray(val) && val.length) {
        qb.andWhere(
          `"${relName}"."${col.databaseName}" IN (:...${paramName})`,
          { [paramName]: val },
        );
      } else {
        // Defecto LIKE sobre texto
        qb.andWhere(
          `"${relName}"."${col.databaseName}"::text LIKE :${paramName}`,
          { [paramName]: `%${val}%` },
        );
        // Exact match
        // qb.andWhere(`"${relName}"."${col.databaseName}" = :${paramName}`, { [paramName]: val });
      }

      return;
    }

    // Filtro por array: IN 
    if (Array.isArray(val) && val.length !== 0) {
      const colMeta = repo.metadata.findColumnWithPropertyName(key);
      if (!colMeta) return;
      const dbCol = colMeta.databaseName;
      qb.andWhere(
        `${alias}."${dbCol}" IN (:...${key})`,
        { [key]: val }
      );
      return;
    }

    // 3) Filtros por columna simple (LIKE)
    const colMeta = repo.metadata.findColumnWithPropertyName(key);
    if (!colMeta) return;
    const dbCol = colMeta.databaseName;
    qb.andWhere(`LOWER(${alias}."${dbCol}"::text) LIKE LOWER(:${key})`, { [key]: `%${val}%` });
  });

  // Ordenación
  if (sortBy) {
    const colMeta = repo.metadata.findColumnWithPropertyName(sortBy);
    if (colMeta) {
      qb.orderBy(`${alias}.${sortBy}`, order as 'ASC' | 'DESC');
    }
  }

  // Paginación: salto y límite
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();
  return {
    page,
    limit,
    totalItems: total,
    totalPages: Math.ceil(total / limit),
    data,
  };
}
