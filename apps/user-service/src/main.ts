import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { registerGlobal } from '~/apps/core/src/global/index.global';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  registerGlobal();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.TCP,
    },
  );
  app.listen();
}
bootstrap();
