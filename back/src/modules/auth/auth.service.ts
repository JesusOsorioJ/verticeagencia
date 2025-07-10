import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from 'src/config/config';
import { UsuariosService } from '../usuarios/usuarios.service';
import { BcryptService } from 'src/libs/bcrypt/bcrypt.service';
import { JwtService } from 'src/libs/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsuariosService,
    @Inject(config.KEY)
    private readonly configService: ConfigType<typeof config>,
    private bcryptService: BcryptService,
    private jwtService: JwtService
  ) {}

  async validateUser(emailOrUsername: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmailOrUsername(emailOrUsername);
    if (!user) throw new UnauthorizedException('Credenciales no válidas');

    const isMatch = await this.bcryptService.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales no válidas');

    const userActive = await this.usersService.findByEmailOrUsernameActive(
      emailOrUsername
    );
    // if (!userActive) throw new UnauthorizedException('Usuario inactivo debe confirmar correo electronico');

    return userActive;
  }

  async login(user: any): Promise<any> {
    const payload = {
      id: user.id,
      email: user.email,
    };
    
    return {
      id: user.id,
      email: user.email,
      access_token: this.jwtService.sign(payload, {
        expiresIn: this.configService.jwt.JWT_ACCESS_TOKEN_EXPIRATION,
      }),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.configService.jwt.JWT_REFRESH_TOKEN_EXPIRATION,
      }),
    };
  }
}