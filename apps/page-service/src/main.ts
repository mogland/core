import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { registerStdLogger } from '~/shared/global/consola.global';
import { registerGlobal } from '~/shared/global/index.global';
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
