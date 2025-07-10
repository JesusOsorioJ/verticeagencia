import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import config from 'src/config/config';
import { BcryptService } from './bcrypt.service';

@Global()
@Module({})
export class BcryptModule {
  static registerAsync(): DynamicModule {
    return {
      module: BcryptModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: BcryptService,
          useFactory: (cfg: ConfigType<typeof config>) => {
            return new BcryptService(cfg.api.SALT_ROUNDS);
          },
          inject: [config.KEY],
        },
      ],
      exports: [BcryptService],
    };
  }
}
