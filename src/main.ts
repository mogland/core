import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import configs from "./configs";
import globals from "./globals";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";

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
  const options = new DocumentBuilder()
    .setTitle("Nest-server")
    .setDescription("Nest-server API Docs")
    .setVersion("1.0")
    // .addTag('main')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(configs.port, '0.0.0.0', async() => {
    Logger.log(`Server running on http://localhost:${configs.port}`);
  });
}
bootstrap();
