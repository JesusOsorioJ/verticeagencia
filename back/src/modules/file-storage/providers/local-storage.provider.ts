import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { promises as fsp } from 'fs';
import * as path from 'path';
import { FileMetadata, FileStorageProvider, FileUploadOptions } from '../interfaces/file-storage.interface';

@Injectable()
export class LocalStorageProvider implements FileStorageProvider {
  private readonly basePath: string;

  constructor(basePath: string = 'uploads') {
    this.basePath = basePath;
    if (!fs.existsSync(this.basePath)) {
      fs.mkdirSync(this.basePath, { recursive: true });
    }
  }

  async upload(file: Buffer | string, options: FileUploadOptions): Promise<FileMetadata> {
    const filename = options.filename;
    const filePath = path.join(this.basePath, filename);
    await fsp.writeFile(filePath, file);
    return { path: filePath};
  }

  async delete(fileId: string): Promise<void> {
    const filePath = path.join(this.basePath, fileId);
    await fsp.unlink(filePath);
  }

}
