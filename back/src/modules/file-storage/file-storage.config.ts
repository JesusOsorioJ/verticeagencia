import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';

const env = process.env.NODE_ENV;
config({ path: `.env.${env}` });

export interface FileStorageConfig {
  provider: 'local' | 's3';
  local: {
    basePath: string;
  };
  s3?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucket: string;
    baseDirectory?: string;
  };
}

export default registerAs('fileStorage', (): FileStorageConfig => ({
  provider: (process.env.FILE_STORAGE_PROVIDER as any) || 'local',
  local: {
    basePath: process.env.FILE_STORAGE_LOCAL_PATH || 'uploads',
  },
  s3: process.env.FILE_STORAGE_PROVIDER === 's3'
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        region: process.env.AWS_REGION!,
        bucket: process.env.AWS_S3_BUCKET!,
        baseDirectory: process.env.FILE_STORAGE_S3_BASE_DIRECTORY,
      }
    : undefined,
}));
