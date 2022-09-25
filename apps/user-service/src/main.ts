import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { registerStdLogger } from '~/shared/global/consola.global';
import { registerGlobal } from '~/shared/global/index.global';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger();
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.TCP,
    },
  );
  app.listen();
}
bootstrap();
