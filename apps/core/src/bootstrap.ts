/*
 * @FilePath: /nx-core/apps/core/src/bootstrap.ts
 * @author: Wibus
 * @Date: 2022-09-03 14:19:53
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-03 16:11:53
 * Coding With IU
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { fastifyApp } from './common/adapt/fastify.adapt';
import { CROSS_DOMAIN, PORT } from "./app.config";

const Origin = CROSS_DOMAIN.allowedOrigins;

declare const module: any;

export async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyApp, { logger: ["error", "debug"] });
  const hosts = Origin.map((host) => new RegExp(host, "i"));

  app.enableCors({
    origin: (origin, callback) => {
      const allow = hosts.some((host) => host.test(origin));

      callback(null, allow);
    },
    credentials: true,
  });

  // @ts-ignore
  !isDev && app.setGlobalPrefix(`api`);
  await app.listen(+PORT, "0.0.0.0", async (err) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
    }
    // @ts-ignore
    consola.info("ENV:", process.env.NODE_ENV);
    const url = await app.getUrl();
    const pid = process.pid;

    const prefix = "P";
    // @ts-ignore
    if (isDev || argv.dev_online == "true") {
      // @ts-ignore
      consola.debug(`[${prefix + pid}] OpenApi: ${url}/api-docs`);
    }
    // @ts-ignore
    consola.success(`[${prefix + pid}] 服务器正在监听: ${url}`);
    Logger.log(
      `NxServer 已启动. ${chalk.yellow(`+${performance.now() | 0}ms`)}`
    );
  });
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
