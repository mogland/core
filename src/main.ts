import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import globals from "./globals";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { UsersService } from "modules/users/users.service";
import { HttpExceptionFilter } from "common/filters/http-exception.filter";
import configs from "./configs";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  if (configs.cors) {
    app.enableCors({
      origin: [process.env.CORS_SERVER || "127.0.0.1:9000","localhost:9000"],
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
    .setTitle("G-server")
    .setDescription("G-server API Docs")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(configs.port, '127.0.0.1', async() => {
    Logger.log(`[gSpaceHelper] G-server running as ${process.env.NODE_ENV}`);
    Logger.log(`[gSpaceHelper] Server running on http://localhost:${configs.port}`);
    Logger.log(`[gSpaceHelper] Swagger running on http://localhost:${configs.port}/api-docs`);
  });

  
  const usersService = app.get(UsersService);
  const users = await usersService.findAll();
  if (!users.length){
    await usersService.create({
      name: 'master',
      password: 'master',

    })
    Logger.log('[gSpaceHelper] master user created');
  }
}
bootstrap();
