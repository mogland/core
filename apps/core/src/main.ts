import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(2330, "", async () => {
    Logger.log("ENV:", process.env.NODE_ENV);
    const url = await app.getUrl();
    const pid = process.pid;
    const prefix = "P"
    
    Logger.log(`[${prefix + pid}] 服务器正在监听: ${url}`);
    Logger.log(
      `NxServer 已启动. ${(`+${performance.now() | 0}ms`)}`
    );
  });
}
bootstrap();
