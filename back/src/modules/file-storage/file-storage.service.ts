import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import fileStorageConfig from './file-storage.config';
import {
  FileStorageProvider,
  FileUploadOptions,
  FileMetadata,
} from './interfaces/file-storage.interface';
import { LocalStorageProvider } from './providers/local-storage.provider';
import { S3StorageProvider } from './providers/s3-storage.provider';
import { InjectRepository } from '@nestjs/typeorm';
import { Filestorage } from './entities/filestorage.entity';
import { Repository } from 'typeorm';
import { CreateFileStorageDto } from './dto/create-file-storage.dto';
import { UpdateFileStorageDto } from './dto/update-file-storage.dto';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class FileStorageService extends BaseService<
  Filestorage,
  CreateFileStorageDto,
  UpdateFileStorageDto
>  {
  private providerInstance: FileStorageProvider;

  constructor(
    @Inject(fileStorageConfig.KEY)
    private config: ConfigType<typeof fileStorageConfig>,
    @InjectRepository(Filestorage)
    private filestorageRepository: Repository<Filestorage>,
  ) {
    super(filestorageRepository);
    if (this.config.provider === 's3' && this.config.s3) {
      this.providerInstance = new S3StorageProvider(this.config.s3);
    } else {
      this.providerInstance = new LocalStorageProvider(this.config.local.basePath);
    }
  }

  async hardDelete(id: string): Promise<void> {
    const entity = await this.findOne(id);
    if (!entity)
      throw new NotFoundException(
        `${this.filestorageRepository.metadata.name} no fue encontrado con ID ${id}`,
      );
    const res = await this.filestorageRepository.delete(id);
    if (res.affected === 0) {
      throw new NotFoundException(
        `${this.filestorageRepository.metadata.name} no fue encontrado`,
      );
    }

    // Añadir lógica para eliminar el archivo del proveedor de almacenamiento
  }


  upload(
    file: Buffer | string,
    options: FileUploadOptions,
  ): Promise<FileMetadata> {
    return this.providerInstance.upload(file, options);
  }

  delete(fileId: string): Promise<void> {
    return this.providerInstance.delete(fileId);
  }

}
