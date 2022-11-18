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
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger();

  const argv = BasicCommer.parse().opts();
  readEnv(ServicesEnum.core, argv, argv.config);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: getEnv(ServicesEnum.user).port || ServicePorts.user,
        host: getEnv(ServicesEnum.user).host || undefined,
      },
    },
  );
  app.listen();
}
bootstrap();
