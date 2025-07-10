import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Usuarios } from 'src/modules/usuarios/entities/usuarios.entity';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Usuarios => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as Usuarios;
    if (!user.id) {
      throw new UnauthorizedException('User not found in request');
    }
    return user;
  },
);