import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { BasicCommer } from '~/shared/commander';
import { LoggingInterceptor } from '~/shared/common/interceptors/logging.interceptor';
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { consola, registerStdLogger } from '~/shared/global/consola.global';
import { registerGlobal } from '~/shared/global/index.global';
import { isDev } from '~/shared/utils';
import { getEnv, readEnv } from '~/shared/utils/rag-env';
import { fastifyApp } from './fastify.adapt';
import { ThemesServiceModule } from './themes-service.module';

declare const module: any;

async function bootstrap() {
  registerGlobal();
  registerStdLogger();

  const argv = BasicCommer.parse().opts();
  readEnv(argv, argv.config);
  const app = await NestFactory.create<NestFastifyApplication>(
    ThemesServiceModule,
    fastifyApp,
    { logger: ['error', 'debug'] },
  );
  if (isDev) {
    app.useGlobalInterceptors(new LoggingInterceptor());
  }

  app.useGlobalPipes(
    new ValidationPipe({
      // 校验请求参数
      transform: true,
      whitelist: true,
      errorHttpStatusCode: 422,
      forbidUnknownValues: true,
      enableDebugMessages: isDev,
      stopAtFirstError: true,
    }),
  );

  app.connectMicroservice({
    transport: Transport.REDIS,
    ...REDIS_TRANSPORTER,
  });
  await app.startAllMicroservices();
  const listening_ip =
    getEnv(ServicesEnum.theme)?.['listening_ip'] || '0.0.0.0';
  const PORT = getEnv(ServicesEnum.theme)?.['port'] || ServicePorts.themes;
  await app.listen(+PORT, listening_ip, async (err) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
    }

    consola.info('ENV:', process.env.NODE_ENV);
    const pid = process.pid;

    const prefix = 'P';

    consola.success(`[${prefix + pid}] 微服务已连接 REDIS 并启动`);
    consola.success(
      `[${prefix + pid}] 服务器正在监听: ${listening_ip}:${PORT}`,
    );
    consola.success(
      `主题服务已启动. ${chalk.yellow(`+${performance.now() | 0}ms`)}`,
    );
  });
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
