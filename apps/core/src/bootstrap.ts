/*
 * @FilePath: /nx-core/apps/core/src/bootstrap.ts
 * @author: Wibus
 * @Date: 2022-09-03 14:19:53
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-03 22:11:56
 * Coding With IU
 */

import { Logger, ValidationPipe } from '@nestjs/common';
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

  app.useGlobalPipes(
    new ValidationPipe({
      // 校验请求参数
      transform: true, // 将错误信息转换为异常
      whitelist: true, // 允许所有参数
      errorHttpStatusCode: 422, // 返回422错误
      forbidUnknownValues: true, // 禁止未知参数
      // @ts-ignore
      enableDebugMessages: isDev, // 开启调试模式
      stopAtFirstError: true, // 在第一个错误后立即停止
    })
  );

  // @ts-ignore
  !isDev && app.setGlobalPrefix(`api`);

  // @ts-ignore
  if (isDev) {
    const { DocumentBuilder, SwaggerModule } = await import("@nestjs/swagger");
    const options = new DocumentBuilder()
      .setTitle("API")
      .setDescription("The blog API description")
      // .setVersion(`${APIVersion}`)
      .addSecurity("bearer", {
        type: "http",
        scheme: "bearer",
      })
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup("api-docs", app, document);
  }

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