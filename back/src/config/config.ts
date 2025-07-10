import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  api: {
    NODE_ENV: process.env.NODE_ENV || 'development',
    NODE_PORT: parseInt(process.env.NODE_PORT || '3001'),
    NODE_HOST: process.env.NODE_HOST || 'localhost',
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS || '10'),
  },

  database: {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '5432'),
    DB_USERNAME: process.env.DB_USERNAME || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'mi_clave_segura',
    DB_NAME: process.env.DB_NAME || 'copia',
  },

  jwt: {
    SECRET_JWT: process.env.SECRET_JWT || 'SECRET_KEY',
    JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '200m',
    JWT_REFRESH_TOKEN_EXPIRATION: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d',
  },

  uploadFile: {
    FILE_STORAGE_PROVIDER: process.env.FILE_STORAGE_PROVIDER || 'local',
    FILE_STORAGE_LOCAL_PATH: process.env.FILE_STORAGE_LOCAL_PATH || 'uploads',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    AWS_REGION: process.env.AWS_REGION || '',
    AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || '',
    FILE_STORAGE_S3_BASE_DIRECTORY: process.env.FILE_STORAGE_S3_BASE_DIRECTORY || '',
  },

  url: {
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  },

  stripe: {
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  },

}));
