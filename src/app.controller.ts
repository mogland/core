import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  // Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation } from "@nestjs/swagger";
import { LocalAuthGuard } from "./modules/auth/local-auth.guard";
import { AuthService } from "./modules/auth/auth.service";
import { AppService } from "app.service";
import { UsersService } from "modules/users/users.service";

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
    private readonly userService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  @ApiOperation({ summary: "登陆管理员" })
  async login(@Request() req) {
    // console.log(req)
    return this.authService.login(req.user);
  }

  // @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "获取管理员信息" })
  @Get("profile")
  // getProfile(@Query() req) {
  //   return this.authService.checkUser(req.user);
  // }
  getProfile(){
    return this.authService.checkUser();
  }

  // 修改信息
  @UseGuards(AuthGuard("jwt"))
  @Post("profile")
  async changeProfile(@Body() data){
    return this.userService.edit(data);
  }
  
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "检测密钥是否可用" })
  @Get("/super/ping")
  ping() {
    // successful notice
    return {
      "status": 200,
      "message": "The key effective",
      "url": "/api/v1/super/ping"
    };
  }

  @Get("/stats")
  async stats() {
    return this.appService.getStat();
  }

}
