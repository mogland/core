import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ServicePorts } from '~/shared/constants/services.constant';
import { registerStdLogger } from '~/shared/global/consola.global';
import { registerGlobal } from '~/shared/global/index.global';
import { PageServiceModule } from './page-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PageServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: ServicePorts.page,
      },
    },
  );
  await app.listen();
}
bootstrap();
