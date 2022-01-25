import { NestFactory } from "@nestjs/core"; // 引入NestFactory
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"; // swagger
import globals from "./globals"; // 全局变量
import { AppModule } from "./app.module"; // 导入模块
import { Logger } from "@nestjs/common"; // 引入日志
import { UsersService } from "./modules/users/users.service"; // 用户服务
import configs from "./configs"; // 引入配置文件
import { SpiderGuard } from "./common/guards/spiders.guard"; // 爬虫检查

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // create app

  if (configs.cors) { // 允许跨域
    const Origin = process.env.CORS_SERVER?.split?.(','); // 允许跨域的域名
    // 如果 Origin 为空，则设置为 *
    const hosts = Origin.map((host) => new RegExp(host, 'i'))
    app.enableCors( 
      Origin
        ? {
          origin: (origin, callback) => {
            const allow = hosts.some((host) => host.test(origin)) // 判断是否允许跨域
            callback(null, allow) // 回调
          },
          credentials: true, // 允许携带cookie
        }
        : undefined, // 如果没有设置允许跨域，则不允许跨域
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
  await app.listen(process.env.PORT ? process.env.PORT : 3000, '127.0.0.1', async() => { // 监听端口
    Logger.log(`[gSpaceHelper] 已启动端口监听`);
    Logger.log(`[gSpaceHelper] G-server is running as ${process.env.NODE_ENV}`);
    Logger.log(`[gSpaceHelper] Server is running on http://localhost:${process.env.PORT ? process.env.PORT : 3000}`);
    Logger.log(`[gSpaceHelper] 正在构建Swagger文档`);
    const document = SwaggerModule.createDocument(app, options); // 创建swagger文档
    SwaggerModule.setup("api-docs", app, document); // 导出swagger文档
    Logger.log(`[gSpaceHelper] Swagger is running on http://localhost:${process.env.PORT ? process.env.PORT : 3000}/api-docs`);
    Logger.log(`[gSpaceHelper] GoldenSpace 已准备好，正在工作...`);
  });


  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  
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
    Logger.log('[gSpaceHelper] master user created'); // 打印日志
  }
}
bootstrap();  // 启动