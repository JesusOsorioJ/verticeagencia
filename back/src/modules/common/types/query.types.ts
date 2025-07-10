import { statusGroups } from "src/modules/pagos/interfaces/iPagos";

type StatusGroupKey = keyof typeof statusGroups;
/**
 * Filtros genéricos: cualquier clave (string) → any,
 * más page/limit para paginación
 */
export interface QueryFilters {
  /** Página solicitada (por defecto 1) */
  page?: number;
  /** Límite de elementos por página (por defecto 10) */
  limit?: number;
  /** Campo por el que ordenar */
  sortBy?: string;
  /** Dirección de orden: ASC o DESC */
  order?: 'ASC' | 'DESC';
  /** Filtros dinámicos: <campo>, <campo>From, <campo>To, etc. */
  [key: string]: any;
  statusGroups: StatusGroupKey
}

