/*
 * @FilePath: /mog-core/apps/core/src/modules/user/user.controller.ts
 * @author: Wibus
 * @Date: 2022-09-03 22:26:41
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-01 15:12:42
 * Coding With IU
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { LoginDto, UserDto } from '~/apps/user-service/src/user.dto';
import { UserModel } from '~/apps/user-service/src/user.model';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { HttpCache } from '~/shared/common/decorator/cache.decorator';
import { IpLocation, IpRecord } from '~/shared/common/decorator/ip.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { RequestUserToken } from '~/shared/common/decorator/request-user.decorator';
import { UserEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

@Controller('user')
@ApiName
export class UserController {
  constructor(@Inject(ServicesEnum.user) private readonly user: ClientProxy) {}

  @Get('/ping')
  @ApiOperation({ summary: '检测服务是否在线' })
  ping() {
    return transportReqToMicroservice(this.user, UserEvents.Ping, {});
  }

  @Get('info')
  @ApiOperation({ summary: '获取用户信息' })
  getUser(
    @Query('username') username: string,
    @Query('getLoginIp') getLoginIp = false,
  ) {
    return transportReqToMicroservice(this.user, UserEvents.UserGet, {
      username,
      getLoginIp,
    });
  }

  @Get('check')
  @ApiOperation({ summary: '检查 Token 是否有效' })
  @Auth()
  checkToken() {
    return true;
  }

  @Get('/master/info')
  @ApiOperation({ summary: '获取主人信息' })
  async getMaster() {
    return transportReqToMicroservice(this.user, UserEvents.UserGetMaster, {});
  }

  @Post('/register')
  @HttpCache.disable
  @ApiOperation({ summary: '注册用户' })
  register(@Body() user: UserDto) {
    return transportReqToMicroservice(this.user, UserEvents.UserRegister, user);
  }

  @Put('/info')
  @HttpCache.disable
  @ApiOperation({ summary: '修改用户信息' })
  patch(@Body() data: Partial<UserModel>) {
    return transportReqToMicroservice(this.user, UserEvents.UserPatch, data);
  }

  @Post('/login')
  @HttpCache.disable
  @HttpCode(200)
  @ApiOperation({ summary: '登录' })
  async login(@Body() dto: LoginDto, @IpLocation() ipLocation: IpRecord) {
    return transportReqToMicroservice(this.user, UserEvents.UserLogin, {
      dto,
      ipLocation,
    });
  }

  @Post('/logout')
  @Auth()
  async logout(@RequestUserToken() token: string) {
    return transportReqToMicroservice(this.user, UserEvents.UserLogout, token);
  }

  @Post('/logoutAll')
  @Auth()
  async logoutAll() {
    return transportReqToMicroservice(this.user, UserEvents.UserLogoutAll, {});
  }

  @Get(['/sessions'])
  @Auth()
  @ApiOperation({ summary: '获取所有session' })
  async getAllSession(@RequestUserToken() token: string) {
    return transportReqToMicroservice(
      this.user,
      UserEvents.UserGetAllSession,
      token,
    );
  }

  @Delete('/session/:tokenId')
  @Auth()
  @ApiOperation({ summary: '删除指定的session' })
  async deleteSession(@Param('tokenId') tokenId: string) {
    return transportReqToMicroservice(
      this.user,
      UserEvents.UserLogout,
      tokenId,
    );
  }

  @Delete('/session/all')
  @Auth()
  @ApiOperation({ summary: '获取所有session' })
  async deleteAllSession() {
    return transportReqToMicroservice(this.user, UserEvents.UserLogoutAll, {});
  }
}
