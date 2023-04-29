import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { REDIS } from '~/apps/core/src/app.config';
import { BasicCommer } from '~/shared/commander';
import { registerStdLogger } from '~/shared/global/consola.global';
import { mkStoreDir, registerGlobal } from '~/shared/global/index.global';
import { readEnv } from '~/shared/utils/rag-env';
import { StoreServiceModule } from './store-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger("store");
  mkStoreDir();

  const argv = BasicCommer.parse().opts();
  readEnv(argv, argv.config);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StoreServiceModule,
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
  app.listen().then(() => {
    Logger.log(`>> StoreService 正在工作... <<`)
  })
}
bootstrap();
