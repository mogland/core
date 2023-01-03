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
import { CommentsServiceModule } from './comments-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger();

  const argv = BasicCommer.parse().opts();
  readEnv(argv, argv.config);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CommentsServiceModule,
    {
      transport: Transport.TCP,
      options: {
        port: getEnv(ServicesEnum.comments).port || ServicePorts.comments,
        host: getEnv(ServicesEnum.comments).host || undefined,
      },
    },
  );
  app.listen();
}
bootstrap();
