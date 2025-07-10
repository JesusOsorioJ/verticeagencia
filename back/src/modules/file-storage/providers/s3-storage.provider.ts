import { Injectable } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { FileMetadata, FileStorageProvider, FileUploadOptions } from '../interfaces/file-storage.interface';

@Injectable()
export class S3StorageProvider implements FileStorageProvider {
  private client: S3;
  constructor(private readonly cfg: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    baseDirectory?: string;
  }) {
    this.client = new S3({
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
      region: cfg.region,
    });
  }

  async upload(file: Buffer | string, options: FileUploadOptions): Promise<FileMetadata> {
    const filename = options.filename;

    await this.client.putObject({
      Bucket: this.cfg.bucket,
      Key: filename,
      Body: typeof file === 'string' ? Buffer.from(file) : file,
      ACL: (options.acl || 'private') as any,
      ContentType: options.metadata?.contentType || 'application/octet-stream',
      Metadata: options.metadata,
    });

    return {
      url: `https://${this.cfg.bucket}.s3.amazonaws.com/${filename}`,
    };
  }

  async delete(fileId: string): Promise<void> {
    await this.client.deleteObject({ Bucket: this.cfg.bucket, Key: fileId });
  }
}
