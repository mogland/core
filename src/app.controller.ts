import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation } from "@nestjs/swagger";
import { LocalAuthGuard } from "./modules/auth/local-auth.guard";
import { AuthService } from "./modules/auth/auth.service";
import { AppService } from "app.service";

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  @ApiOperation({ summary: "登陆管理员" })
  async login(@Request() req) {
    // console.log(req)
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "获取管理员信息" })
  @Get("profile")
  getProfile(@Body() req) {
    return this.authService.checkUser(req.username);
  }
  
  @Get("/ping")
  ping() {
    return "pong";
  }

  @Get("/stats")
  async stats() {
    return this.appService.getStat();
  }
}
