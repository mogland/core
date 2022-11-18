import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BasicCommer } from '~/shared/commander';
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';
import { registerStdLogger } from '~/shared/global/consola.global';
import { registerGlobal } from '~/shared/global/index.global';
import { getEnv, readEnv } from '~/shared/utils/rag-env';
import { PageServiceModule } from './page-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger();

  const argv = BasicCommer.parse().opts();
  readEnv(ServicesEnum.core, argv, argv.config);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PageServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: getEnv(ServicesEnum.page).port || ServicePorts.page,
        host: getEnv(ServicesEnum.page).host || undefined,
      },
    },
  );
  await app.listen();
}
bootstrap();
