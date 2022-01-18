import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import globals from "./globals";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { UsersService } from "modules/users/users.service";
import configs from "./configs";
import { SpiderGuard } from "common/guards/spiders.guard";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (configs.cors) {
    const Origin = process.env.CORS_SERVER?.split?.(',') || ["*"]; // baidu.com, google.com
    const hosts = Origin.map((host) => new RegExp(host, 'i'))
    app.enableCors(
      {
        origin: (origin, callback) => {
          const allow = hosts.some((host) => host.test(origin))

          callback(null, allow)
        },
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        credentials: true,
      },
    );
  }

  app.useGlobalGuards(new SpiderGuard())

  app.setGlobalPrefix("api/v" + globals.API_VERSION);

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
  if (await usersService.find({type: "num"}) == 0) {
    await usersService.create({
      name: 'master',
      password: 'master',
      email: '@example.com',
      level: 'master',
      status: 'active',
      lovename: 'master',
      description: 'master',
      avatar: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?s=80&d=identicon&r=PG',
      QQ: '123456789',
    })
    Logger.log('[gSpaceHelper] master user created');
  }
}
bootstrap();
