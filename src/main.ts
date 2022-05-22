import { NestFactory } from "@nestjs/core"; // 引入NestFactory
import globals from "./globals"; // 全局变量
import { AppModule } from "./app.module"; // 导入模块
import { Logger, ValidationPipe } from "@nestjs/common"; // 引入日志
import { UsersService } from "./modules/users/users.service"; // 用户服务
import { SpiderGuard } from "./common/guards/spiders.guard"; // 爬虫检查
import { chooseEnv } from "utils/chooseEnv.utils";
import { argv } from "zx";
import { ConfigsService } from "modules/configs/configs.service";
import { isDev } from "utils/tools.util";
import { NestExpressApplication } from "@nestjs/platform-express";
async function bootstrap() {
  console.log(argv);
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // create app

  const Origin = chooseEnv("CORS_SERVER")?.split?.(','); // 允许跨域的域名
  const hosts = Origin && Origin.map((host) => new RegExp(host, 'i'))
  
  // 如果 Origin 为空，则设置为 *
  app.enableCors( 
    hosts
      ? {
        origin: (origin, callback) => {
          const allow = hosts.some((host) => host.test(origin))

          callback(null, allow)
        },
        credentials: true,
      }
      : undefined, 
  )

  app.useGlobalGuards(new SpiderGuard()) // 检查是否是爬虫

  app.setGlobalPrefix("api/v" + globals.API_VERSION); // 设置全局前缀

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 开启验证
      whitelist: true, // 开启白名单
      errorHttpStatusCode: 422, // 错误状态码
      forbidUnknownValues: true, // 禁止未知值
      enableDebugMessages: isDev, // 开启调试模式
      stopAtFirstError: true, // 停止验证
    }),
  ) // 注册全局验证管道

  // 设置模板引擎
  app.setBaseViewsDir(__dirname + "/views");
  app.setViewEngine('ejs');
  // ejs-locals
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.engine('ejs', require('ejs-locals'));


  if (isDev) {
    const { DocumentBuilder, SwaggerModule } = await import('@nestjs/swagger')
    const options = new DocumentBuilder()
      .setTitle('API')
      .setDescription('The blog API description')
      .setVersion(`${globals.API_VERSION}`)
      .addSecurity('bearer', {
        type: 'http',
        scheme: 'bearer',
      })
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api-docs', app, document)
  }

  await app.listen(chooseEnv("PORT") ? chooseEnv("PORT") : 3000, '127.0.0.1', async() => { // 监听端口
    Logger.log(`Get the ${chooseEnv("PORT") ? chooseEnv("PORT") : 3000} port and starting`, "gSpaceHelper");
    Logger.log(`Server is running as ${chooseEnv("NODE_ENV") ? chooseEnv("NODE_ENV") : 'unknown'}`, "gSpaceHelper");
    Logger.log(`API-Service is running on http://localhost:${chooseEnv("PORT") ? chooseEnv("PORT") : 3000}`, "gSpaceHelper");
    { isDev ? Logger.debug(`Swagger-Service is running on http://localhost:${chooseEnv("PORT") ? chooseEnv("PORT") : 3000}/api-docs`, "gSpaceHelper") : Logger.log(`Swagger-Service is not running`, "gSpaceHelper")}
    Logger.log(`NextSpace Server is ready and working...`, "gSpaceHelper");
  });

  const usersService = app.get(UsersService); // 获取用户服务
  if (await usersService.find({type: "num"}) == 0) { // 如果没有用户
    await usersService.create({ // 创建管理员
      name: 'master', // 管理员名
      password: 'master', // 管理员密码 (程序会自动加密)
      email: '@example.com', // 管理员邮箱
      level: 'master', // 管理员等级
      status: 'active', // 管理员状态
      lovename: 'master', // 管理员昵称
      description: 'master', // 管理员描述
      avatar: 'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?s=80&d=identicon&r=PG', // 管理员头像
      QQ: '123456789', // 管理员QQ
    })
    Logger.log('master user created', "gSpaceHelper"); // 打印日志
  }
  const configsService = app.get(ConfigsService)
  await configsService.init()
}
bootstrap();  // 启动