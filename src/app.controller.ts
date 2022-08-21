import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AllowAllCorsInterceptor } from "./common/interceptors/allow-all-cors.interceptor";
import PKG from "../package.json";

@Controller()
@ApiTags("Root")
export class AppController {

  @UseInterceptors(AllowAllCorsInterceptor)
  @Get(["/", "/info"])
  @ApiOperation({ summary: "获取服务端版本等信息" })
  async appInfo() {
    return {
      name: PKG.name,
      author: PKG.author,
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
