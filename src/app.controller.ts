import {
  Controller,
  Get,
  Request,
  Post,
  UseGuards,
  Body,
  Query,
  // Query,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiProperty, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./modules/auth/local-auth.guard";
import { AuthService } from "./modules/auth/auth.service";
import { UsersService } from "./modules/users/users.service";
import { CreateUserDto } from "./shared/dto/create-user-dto";
import { AppService } from "./app.service";

class LoginUser { // 登录用户 
  @ApiProperty() // swagger 
    username: string;  // 用户名
  @ApiProperty()
    password: string; // 密码
}
@Controller() // 控制器
@ApiTags("App")
export class AppController {
  constructor(
    private readonly authService: AuthService, // 登录
    private readonly appService: AppService, // 统计
    private readonly userService: UsersService, // 用户
  ) {}

  @Get("/")
  async helloworld(){
    return {
      "name":"@wibus-wee/nx-server",
      "author":"Wibus <https://github.com/wibus-wee>",
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      "version":require('../package.json').version,
      "homepage":"https://github.com/nx-space/nx-server#readme",
      "issues":"https://github.com/nx-space/nx-server/issues"
    }
  }

  @UseGuards(LocalAuthGuard) // 认证
  @Post("auth/login") // 登录
  @ApiBody({ type: LoginUser }) // swagger
  @ApiOperation({ summary: "登陆管理员" }) // swagger
  async login(@Request() req) {
    // console.log(req)
    return this.authService.login(req.user); // 登录
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
    return this.authService.checkUser(); // 获取管理员信息
  }

  // 修改信息
  @UseGuards(AuthGuard("jwt")) // 认证
  @ApiBody({ type: CreateUserDto }) // swagger
  @ApiOperation({ summary: "修改管理员信息" }) // swagger
  @ApiBearerAuth("access-token") // swagger
  @Post("profile")
  async changeProfile(@Body() data){
    return this.userService.edit(data); // 修改信息
  }

  @ApiOperation({ summary: "点赞" })
  @Get("thumb_up")
  async thumbUp(@Query() query) {
    return this.appService.thumbUp(query.type, query.path);
  }
  
  @UseGuards(AuthGuard("jwt")) // 认证
  @ApiBearerAuth("access-token")
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
    return this.appService.getStat(); // 获取博客信息
  }

  @Get("/check_update")
  @ApiOperation({ summary: "检查更新" })
  async checkUpdate() {
    return this.appService.checkUpdate(); // 检查更新
  }

}
