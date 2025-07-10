import { json, raw, urlencoded } from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';

export function applyAppMiddlewares(app: NestExpressApplication) {
  app.enableCors({ origin: '*', credentials: true });

  // Logging interceptor + pipes
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Webhook raw parser
  app.use(
    '/pagos/webhook',
    raw({
      type: '*/*',
      verify: (req: any, _res, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(json());
  app.use(urlencoded({ extended: true }));


}
