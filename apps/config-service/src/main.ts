import { NestFactory } from '@nestjs/core';
import { ConfigServiceModule } from './config-service.module';
import { registerGlobal } from '~/shared/global/index.global';
import { registerStdLogger } from '~/shared/global/consola.global';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { REDIS } from '~/apps/core/src/app.config';
import { BasicCommer } from '~/shared/commander';
import { readEnv } from '~/shared/utils/rag-env';

async function bootstrap() {
  registerGlobal();
  registerStdLogger('config');

  const argv = BasicCommer.parse().opts();
  readEnv(argv, argv.config);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ConfigServiceModule,
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
  app.listen();
}
bootstrap();
