import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import configs from "./configs";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (configs.cors) {
    app.enableCors({
      origin: configs.cors_server, //array
    });
  }
  const options = new DocumentBuilder()
    .setTitle("Nest-server")
    .setDescription("Nest-server API Docs")
    .setVersion("1.0")
    // .addTag('main')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(configs.port);
}
bootstrap();
