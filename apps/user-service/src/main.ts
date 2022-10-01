import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ServicePorts } from '~/shared/constants/services.constant';
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
      options: {
        port: ServicePorts.user,
      },
    },
  );
  app.listen();
}
bootstrap();
