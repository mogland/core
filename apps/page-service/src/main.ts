import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { REDIS } from '~/apps/core/src/app.config';
import { BasicCommer } from '~/shared/commander';

import { registerStdLogger } from '~/shared/global/consola.global';
import { registerGlobal } from '~/shared/global/index.global';
import { readEnv } from '~/shared/utils/rag-env';
import { PageServiceModule } from './page-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger("page");

  const argv = BasicCommer.parse().opts();
  readEnv(argv, argv.config);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    PageServiceModule,
    {
      transport: Transport.REDIS,
      options: {
        port: REDIS.port,
        host: REDIS.host,
        password: REDIS.password,
        username: REDIS.user,
      },
    },
  );
  await app.listen();
}
bootstrap();
