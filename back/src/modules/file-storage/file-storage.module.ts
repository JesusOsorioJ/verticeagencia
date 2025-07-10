import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import fileStorageConfig from './file-storage.config';
import { FileStorageService } from './file-storage.service';
import { FileStorageController } from './file-storage.controller';
import { Filestorage } from './entities/filestorage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forFeature(fileStorageConfig),
    TypeOrmModule.forFeature([Filestorage])
  ],
  providers: [FileStorageService],
  controllers: [FileStorageController],
  exports: [FileStorageService],
})
export class FileStorageModule {}
