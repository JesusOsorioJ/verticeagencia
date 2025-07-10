export interface FileMetadata {
 
  path?: string;
  url?: string;
  bucket?: string;
  key?: string;
}

export interface FileUploadOptions {
  filename: string;
  path?: string;
  acl?: string;
  metadata?: Record<string, any>;
}

export interface FileStorageProvider {
  upload(file: Buffer | string, options: FileUploadOptions): Promise<FileMetadata>;
  delete(fileId: string): Promise<void>;
}