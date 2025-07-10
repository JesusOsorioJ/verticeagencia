import { Module, DynamicModule, Global } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import config from 'src/config/config';
import { JwtService } from './jwt.service';

@Global()
@Module({})
export class JwtModule {
  static registerAsync(): DynamicModule {
    return {
      module: JwtModule,
      imports: [
        ConfigModule,
        NestJwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (cfg: ConfigType<typeof config>) => ({
            secret: cfg.jwt.SECRET_JWT,
            signOptions: { expiresIn: cfg.jwt.JWT_ACCESS_TOKEN_EXPIRATION },
          }),
          inject: [config.KEY],
        }),
      ],
      providers: [JwtService],
      exports: [JwtService],
    };
  }
}
