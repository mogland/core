import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BasicCommer } from '~/shared/commander';
import {
  ServicesEnum,
  ServicePorts,
} from '~/shared/constants/services.constant';
import { registerStdLogger } from '~/shared/global/consola.global';
import { registerGlobal } from '~/shared/global/index.global';
import { readEnv, getEnv } from '~/shared/utils/rag-env';
import { FriendsServiceModule } from './friends-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger();

  const argv = BasicCommer.parse().opts();
  readEnv(argv, argv.config);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    FriendsServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: getEnv(ServicesEnum.friends)?.port || ServicePorts.friends,
        host: getEnv(ServicesEnum.friends)?.host || undefined,
      },
    },
  );
  app.listen();
}
bootstrap();
