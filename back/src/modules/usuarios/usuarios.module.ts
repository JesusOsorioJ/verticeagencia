import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsuariosService } from './usuarios.service';
import { UsersController } from './usuarios.controller';
import { Usuarios } from './entities/usuarios.entity';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  imports: [TypeOrmModule.forFeature([Usuarios]), ConfigModule, FileStorageModule  ],
  controllers: [UsersController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
