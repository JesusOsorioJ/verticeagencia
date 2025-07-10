import { Repository, FindOptionsWhere, ObjectLiteral, DeepPartial } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { paginateAndFilter, Paginated } from '../pagination';
import { QueryFilters } from '../types/query.types';
import { RelationMetadata } from 'typeorm/metadata/RelationMetadata';

export abstract class BaseService<
  Entity extends ObjectLiteral,
  CreateDto,
  UpdateDto,
  ID extends string | number = string
> {
  protected constructor(protected readonly repo: Repository<Entity>) {}

  /** Obtiene el nombre de la PK (primera columna). */
  getPrimaryKey(): string {
    return this.repo.metadata.primaryColumns[0].propertyName;
  }

  /** Valida que un campo sea FK de ManyToOne y devuelve su metadata. */
  findRelationWithPropertyPath(fieldName: string): RelationMetadata {
    const rel = this.repo.metadata.relations.find(
      (r) =>
        r.relationType === 'many-to-one' &&
        r.joinColumns.some((jc) => jc.databaseName === fieldName)
    );
    if (!rel) {
      throw new BadRequestException(
        `El campo '${fieldName}' no es una FK de relación ManyToOne válida`
      );
    }
    return rel;
  }

  /**
   * Mapea los campos del DTO que sean FK de OneToOne o ManyToOne
   * a la forma { relationName: { id: valor } }, borrando la propiedad
   * numérica plana (ej: userId).
   */
  private prepareRelationsFromDto(dto: any): DeepPartial<Entity> {
    const payload: any = { ...dto };
    for (const rel of this.repo.metadata.relations) {
      if (rel.isOneToOne || rel.isManyToOne) {
        const joinCol = rel.joinColumns[0];
        if (!joinCol?.referencedColumn) continue;
        const idField = joinCol.databaseName;
        const targetKey = joinCol.referencedColumn.propertyName;
        const idValue = (dto as any)[idField];
        if (idValue != null) {
          payload[rel.propertyName] = { [targetKey]: idValue };
        }
        delete payload[idField];
      }
    }
    return payload;
  }

  /** Crea una nueva entidad y la devuelve con **todas** sus relaciones pobladas. */
  async create(dto: CreateDto): Promise<Entity> {
    const payload = this.prepareRelationsFromDto(dto);
    const entity = this.repo.create(payload);
    return await this.repo.save(entity);
  }

  /** Crea muchas entidades de golpe y las guarda. */
  async createMany(dto: CreateDto[]): Promise<Entity[]> {
    const entities = this.repo.create(
      dto.map((item) => this.prepareRelationsFromDto(item))
    );
    return await this.repo.save(entities);
  }

  /** Obtiene todas las entidades paginadas, filtradas y ordenadas. */
  async findAll(query: QueryFilters): Promise<Paginated<Entity>> {
    return paginateAndFilter(this.repo, query);
  }

  /** Busca una única entidad por ID o por un objeto `where`. */
  async findOne(
    idOrWhere: ID | FindOptionsWhere<Entity>,
    options: { relations?: string[] } = {},
    key?: string
  ): Promise<Entity | null> {
    let where: FindOptionsWhere<Entity>;
    if (typeof idOrWhere === 'object') {
      where = idOrWhere as FindOptionsWhere<Entity>;
    } else {
      const primaryKey = key ?? this.getPrimaryKey();
      where = { [primaryKey]: idOrWhere } as FindOptionsWhere<Entity>;
    }

    const entity = await this.repo.findOne({ where, ...options });
    if (!entity) {
      throw new NotFoundException(
        `${this.repo.metadata.name} no fue encontrado con filtro ${JSON.stringify(where)}`
      );
    }
    return entity;
  }

  /** Actualiza una entidad y la devuelve con relaciones pobladas. */
  async update(id: ID, dto: UpdateDto, key?: string): Promise<Entity | null> {
    const entity = await this.findOne(id);
    const payload = this.prepareRelationsFromDto(dto);
    Object.assign(entity!, payload);
    return await this.repo.save(entity!);
  }

  /** Elimina físicamente una entidad. */
  async hardDelete(id: ID, key?: string): Promise<void> {
    const primaryKey = key ?? this.getPrimaryKey();
    await this.findOne(id, {}, primaryKey);
    const res = await this.repo.delete({ [primaryKey]: id } as any);
    if (res.affected === 0) {
      throw new NotFoundException(`${this.repo.metadata.name} no fue encontrado`);
    }
  }

  /** Soft delete de una entidad. */
  async softDelete(id: ID, key?: string): Promise<void> {
    await this.findOne(id);
    const res = await this.repo.softDelete(id);
    if (res.affected === 0) {
      throw new NotFoundException(`${this.repo.metadata.name} no fue encontrado`);
    }
  }
  /**
   * Retorna una lista con los nombres de todas las relaciones definidas
   * en la entidad actual del repositorio.
   *
   * @returns {string[]} Lista de nombres de relaciones (e.g. ['user', 'category']).
   */
  getRelationNames(): string[] {
    return this.repo.metadata.relations.map((r) => r.propertyName);
  }

  /**
   * Procesa una cadena de consulta de relaciones (`relationsQuery`) y devuelve un arreglo con las relaciones válidas a incluir en la consulta.
   * - Si `relationsQuery` es un JSON válido como '["user","category"]',
   *   solo se incluirán las relaciones que existan en la entidad.
   * - Si `relationsQuery` es la cadena `"true"`, se incluirán **todas** las relaciones.
   *
   * @param {string | undefined} relationsQuery - Cadena de consulta de relaciones.
   * @returns {string[]} Lista filtrada de relaciones a incluir.
   */

  parseRelationsQuery(relationsQuery?: string): string[] {
    const allRels = this.getRelationNames();
    let relsToJoin: string[] = [];

    try {
      const parsed = JSON.parse(relationsQuery ?? 'null');
      if (Array.isArray(parsed)) {
        relsToJoin = parsed.filter((r) => allRels.includes(r));
      } else if (relationsQuery === 'true') {
        relsToJoin = allRels;
      }
    } catch {
      if (relationsQuery === 'true') {
        relsToJoin = allRels;
      }
    }
    return relsToJoin;
  }
}
