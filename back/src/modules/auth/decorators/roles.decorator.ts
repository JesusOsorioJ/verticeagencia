import { SetMetadata } from '@nestjs/common';
import { RoleStatus } from 'src/modules/usuarios/entities/usuarios.entity';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleStatus[]) => SetMetadata(ROLES_KEY, roles);
