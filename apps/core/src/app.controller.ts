import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import PKG from "../../../package.json";
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(["/", "/info"])
  @ApiOperation({ summary: "获取服务端版本等信息" })
  async appInfo() {
    return {
      name: PKG.name,
      author: PKG.author,
      // @ts-ignore
      version: isDev ? "dev" : PKG.version,
      homepage: PKG.homepage,
      issues: PKG.issues,
    };
  }

  @Get(["/ping"])
  @ApiOperation({ summary: "测试接口是否存活" })
  ping(): "pong" {
    return "pong";
  }
}
