import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import configs from "./configs";
import globals from "./globals";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
// import { Logger } from "nestjs-pino";
// import { HttpExceptionFilter } from "common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (configs.cors) {
    app.enableCors({
      origin: configs.cors_server, //array of origins
    });
  }
  // 设置 返回 header
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  app.setGlobalPrefix("api/" + globals.API_VERSION);
  // 设置全局异常过滤器
  // const logger = app.get(Logger);
  // app.useLogger(logger);

  // app.useGlobalFilters(new HttpExceptionFilter(logger));

  const options = new DocumentBuilder()
    .setTitle("Nest-server")
    .setDescription("Nest-server API Docs")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(configs.port, '127.0.0.1', async() => {
    Logger.log(`Nest-server running as ${process.env.NODE_ENV}`);
    Logger.log(`Server running on http://localhost:${configs.port}`);
    Logger.log(`Swagger running on http://localhost:${configs.port}/api-docs`);
  });
}
bootstrap();
