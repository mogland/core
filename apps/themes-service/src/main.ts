import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { BasicCommer } from '~/shared/commander';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { registerStdLogger } from '~/shared/global/consola.global';
import { registerGlobal } from '~/shared/global/index.global';
import { readEnv } from '~/shared/utils/rag-env';
import { ThemesServiceModule } from './themes-service.module';

async function bootstrap() {
  registerGlobal();
  registerStdLogger();

  const argv = BasicCommer.parse().opts();
  readEnv(argv, argv.config);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ThemesServiceModule,
    {
      transport: Transport.REDIS,
      ...REDIS_TRANSPORTER,
    },
  );
  app.listen();
}
bootstrap();
