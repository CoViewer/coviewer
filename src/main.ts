import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as config from '../data/config.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(config.port || 9327);
}

bootstrap();
