import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { registerStdLogger } from '~/apps/core/src/global/consola.global';
import { registerGlobal } from '~/apps/core/src/global/index.global';
import { CategoryServiceModule } from './category-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CategoryServiceModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
}
bootstrap();
