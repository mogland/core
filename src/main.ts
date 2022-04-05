import { NestFactory } from "@nestjs/core"; // 引入NestFactory
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"; // swagger
import globals from "./globals"; // 全局变量
import { AppModule } from "./app.module"; // 导入模块
import { Logger } from "@nestjs/common"; // 引入日志
import { UsersService } from "./modules/users/users.service"; // 用户服务
import { SpiderGuard } from "./common/guards/spiders.guard"; // 爬虫检查
import { chooseEnv } from "utils/chooseEnv.utils";
import { argv } from "zx";
async function bootstrap() {
  console.log(argv ? argv.CORS_SERVER : process.env.CORS_SERVER);
  const app = await NestFactory.create(AppModule); // create app

  const Origin = chooseEnv("CORS_SERVER")?.split?.(','); // 允许跨域的域名
  // 如果 Origin 为空，则设置为 *
  if (Origin) {
    app.enableCors( 
      {
        origin: (origin, callback) => {
          const allow = chooseEnv("CORS_SERVER")?.split?.(',') ? Origin.map((host) => new RegExp(host, 'i')).some((host) => host.test(origin)) : "*" // 判断是否允许跨域
          callback(null, allow) // 回调
        },
        credentials: true, // 允许携带cookie
      }
    ) // 允许跨域
  }

  app.useGlobalGuards(new SpiderGuard()) // 检查是否是爬虫

  app.setGlobalPrefix("api/v" + globals.API_VERSION); // 设置全局前缀

  const options = new DocumentBuilder() // 创建swagger配置
    .addBearerAuth( // 添加bearer验证
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, // 验证方式
      'access-token', // 参数名
    )
    .setTitle("G-server") // 标题
    .setDescription("G-server API Docs")  // 描述
    .setVersion("1.0") // 版本
    .build()
  const document = SwaggerModule.createDocument(app, options); // 创建swagger文档
  SwaggerModule.setup("api-docs", app, document); // 导出swagger文档
  await app.listen(chooseEnv("PORT") ? chooseEnv("PORT") : 3000, '127.0.0.1', async() => { // 监听端口
    Logger.log(`Get the ${chooseEnv("PORT") ? chooseEnv("PORT") : 3000} port and starting`, "gSpaceHelper");
    Logger.log(`Server is running as ${chooseEnv("NODE_ENV") ? chooseEnv("NODE_ENV") : 'unknown'}`, "gSpaceHelper");
    Logger.log(`API-Service is running on http://localhost:${chooseEnv("PORT") ? chooseEnv("PORT") : 3000}`, "gSpaceHelper");
    Logger.debug(`Swagger-Service is running on http://localhost:${chooseEnv("PORT") ? chooseEnv("PORT") : 3000}/api-docs`, "gSpaceHelper");
    Logger.log(`GoldenSpace is ready and working...`, "gSpaceHelper");
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
}
bootstrap();  // 启动