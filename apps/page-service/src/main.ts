import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { registerStdLogger } from '~/apps/core/src/global/consola.global';
import { registerGlobal } from '~/apps/core/src/global/index.global';
import { PageServiceModule } from './page-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger();

  const app = await NestFactory.createMicroservice(PageServiceModule, {
    transport: Transport.TCP,
  });
  await app.listen();
}
bootstrap();
