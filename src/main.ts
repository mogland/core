import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import configs from "./configs";
import globals from "./globals";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { UsersService } from "users/users.service";
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

  const options = new DocumentBuilder()
    .setTitle("G-server")
    .setDescription("G-server API Docs")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api-docs", app, document);

  await app.listen(configs.port, '127.0.0.1', async() => {
    Logger.log(`G-server running as ${process.env.NODE_ENV}`);
    Logger.log(`Server running on http://localhost:${configs.port}`);
    Logger.log(`Swagger running on http://localhost:${configs.port}/api-docs`);
  });

  
  const usersService = app.get(UsersService);
  const users = await usersService.findAll();
  if (!users.length){
    await usersService.create({
      name: 'master',
      password: 'master',

    })
    Logger.log('master user created');
  }

}
bootstrap();
