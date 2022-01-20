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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { LocalAuthGuard } from "./modules/auth/local-auth.guard";
import { AuthService } from "./modules/auth/auth.service";
import { AppService } from "app.service";
import { UsersService } from "modules/users/users.service";
import { CreateUserDto } from "shared/dto/create-user-dto";

class LoginUser {
  @ApiProperty()
    username: string; 
  @ApiProperty()
    password: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly appService: AppService,
    private readonly userService: UsersService
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post("auth/login")
  @ApiBearerAuth()
  @ApiBody({ type: LoginUser })
  @ApiOperation({ summary: "登陆管理员" })
  async login(@Request() req) {
    // console.log(req)
    return this.authService.login(req.user);
  }

  // @UseGuards(AuthGuard("jwt"))
  // @ApiOperation({ summary: "获取管理员信息" })
  @ApiOperation({
    summary: "获取管理员信息",
    description: "由于profile获取的范围是被写死的，也就是在数据库中第一个用户（目前gSpace没有设计多用户功能）所以无论create多少行，始终获取的都是第一个用户",
  })
  @Get("profile")
  // getProfile(@Query() req) {
  //   return this.authService.checkUser(req.user);
  // }
  getProfile(){
    return this.authService.checkUser();
  }

  // 修改信息
  @UseGuards(AuthGuard("jwt"))
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: "修改管理员信息" })
  @ApiBearerAuth()
  @Post("profile")
  async changeProfile(@Body() data){
    return this.userService.edit(data);
  }
  
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
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
  @ApiOperation({ summary: "获取博客信息" })
  async stats() {
    return this.appService.getStat();
  }

}
