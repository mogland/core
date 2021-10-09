import { Controller, Get, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @ApiOperation({summary: '登陆管理员'})
  async login(@Request() req) {
    // console.log(req)
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({summary: '获取管理员信息'})
  @Get('profile')
  getProfile(@Body() req) {
    return this.authService.checkUser(req.username);
  }
}
