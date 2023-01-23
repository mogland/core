import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { PORT } from '~/apps/core/src/app.config';
import { BasicCommer } from '~/shared/commander';
import { LoggingInterceptor } from '~/shared/common/interceptors/logging.interceptor';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { consola, registerStdLogger } from '~/shared/global/consola.global';
import { mkdirs, registerGlobal } from '~/shared/global/index.global';
import { isDev } from '~/shared/utils';
import { getEnv, readEnv } from '~/shared/utils/rag-env';
import { fastifyApp } from './fastify.adapt';
import { ThemesServiceModule } from './themes-service.module';

declare const module: any;

async function bootstrap() {
  registerGlobal();
  mkdirs();
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

  const listening_ip = getEnv(ServicesEnum.core)?.['listening_ip'] || '0.0.0.0';

  await app.listen(+PORT, listening_ip, async (err) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
    }

    consola.info('ENV:', process.env.NODE_ENV);
    const pid = process.pid;

    const prefix = 'P';

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
