import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import type { SignOptions, VerifyOptions } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly jwt: NestJwtService) {}

  sign(payload: any, options?: SignOptions): string {
    return this.jwt.sign(payload, options);
  }

  verify<T extends object = any>(
    token: string,
    options?: VerifyOptions
  ): T {
    return this.jwt.verify<T>(token, options);
  }
}