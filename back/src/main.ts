import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigType } from '@nestjs/config';

import { AppModule } from './app.module';
import config from './config/config';
import { swaggerConfig } from './config/swagger.config';
import { applyAppMiddlewares } from './config/middlewares/app-middlewares';
import { AllExceptionsFilter } from './config/middlewares/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  applyAppMiddlewares(app);

  const configSer: ConfigType<typeof config> = app.get(config.KEY);

  app.useGlobalFilters(new AllExceptionsFilter());

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(configSer.api.NODE_PORT);
  console.log(`API is running on: ${await app.getUrl()}`);
}
bootstrap();


