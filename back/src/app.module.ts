import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import config from 'src/config/config';
import { PagosModule } from './modules/pagos/pagos.module';
import { ProductosModule } from './modules/productos/productos.module';
import { CarritoModule } from './modules/carrito/carrito.module';
import { DatabaseModule } from './database/database.module';
import { SeedingService } from './seeding/seeding.service';
import { SeedingModule } from './seeding/seeding.module';
import { join } from 'path';
import { JwtModule } from './libs/jwt/jwt.module';
import { BcryptModule } from './libs/bcrypt/bcrypt.module';
import { StripeModule } from './libs/stripe/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      load: [config]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),  
      serveRoot: '/uploads',  
    }),
    JwtModule.registerAsync(),
    BcryptModule.registerAsync(),
    StripeModule.registerAsync(),
    SeedingModule,
    DatabaseModule,
    AuthModule,
    FileStorageModule,
    UsuariosModule,
    PagosModule,
    ProductosModule,
    CarritoModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    SeedingService
  ],
})
export class AppModule {}
