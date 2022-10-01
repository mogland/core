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
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import {
  LoginDto,
  UserDto,
  UserPatchDto,
} from '~/apps/user-service/src/user.dto';
import { UserDocument } from '~/apps/user-service/src/user.model';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { HttpCache } from '~/shared/common/decorator/cache.decorator';
import { IpLocation, IpRecord } from '~/shared/common/decorator/ip.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import {
  RequestUser,
  RequestUserToken,
} from '~/shared/common/decorator/request-user.decorator';
import { UserEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';

@Controller('user')
@ApiName
export class UserController {
  constructor(@Inject(ServicesEnum.user) private readonly user: ClientProxy) {}

  @Get('info')
  @ApiOperation({ summary: '获取用户信息' })
  getUser(
    @Query('username') username: string,
    @Query('getLoginIp') getLoginIp = false,
  ) {
    const data = this.user
      .send(
        { cmd: UserEvents.UserGet },
        {
          username,
          getLoginIp,
        },
      )
      .pipe(
        timeout(1000),
        catchError((err) => {
          return throwError(
            () =>
              new HttpException(
                err.message || '未知错误，请联系管理员',
                err.status || 500,
              ),
          );
        }),
      );
    return data;
  }

  @Get('/master/info')
  @ApiOperation({ summary: '获取主人信息' })
  async getMaster() {
    return this.user.send({ cmd: UserEvents.UserGetMaster }, null).pipe(
      timeout(1000),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              err.message || '未知错误，请联系管理员',
              err.status || 500,
            ),
        );
      }),
    );
  }

  @Post('/register')
  @HttpCache.disable
  @ApiOperation({ summary: '注册用户' })
  register(@Body() user: UserDto) {
    // return this.user.send(UserEvents.UserRegister, user);
    return this.user.send({ cmd: UserEvents.UserRegister }, user);
  }

  @Patch('/info')
  @HttpCache.disable
  @ApiOperation({ summary: '修改用户信息' })
  patch(@RequestUser() user: UserDocument, data: UserPatchDto) {
    return this.user
      .send(
        { cmd: UserEvents.UserPatch },
        {
          user,
          data,
        },
      )
      .pipe(
        timeout(1000),
        catchError((err) => {
          return throwError(
            () =>
              new HttpException(
                err.message || '未知错误，请联系管理员',
                err.status || 500,
              ),
          );
        }),
      );
  }

  @Post('/login')
  @HttpCache.disable
  @HttpCode(200)
  @ApiOperation({ summary: '登录' })
  async login(@Body() dto: LoginDto, @IpLocation() ipLocation: IpRecord) {
    return this.user
      .send(
        { cmd: UserEvents.UserLogin },
        {
          dto,
          ipLocation,
        },
      )
      .pipe(
        timeout(1000),
        catchError((err) => {
          return throwError(
            () =>
              new HttpException(
                err.message || '未知错误，请联系管理员',
                err.status || 500,
              ),
          );
        }),
      );
  }

  @Post('/logout')
  @Auth()
  async logout(@RequestUserToken() token: string) {
    return this.user.send({ cmd: UserEvents.UserLogout }, token).pipe(
      timeout(1000),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              err.message || '未知错误，请联系管理员',
              err.status || 500,
            ),
        );
      }),
    );
  }

  @Post('/logoutAll')
  @Auth()
  async logoutAll() {
    return this.user.send({ cmd: UserEvents.UserLogoutAll }, null).pipe(
      timeout(1000),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              err.message || '未知错误，请联系管理员',
              err.status || 500,
            ),
        );
      }),
    );
  }

  @Get(['/sessions'])
  @Auth()
  @ApiOperation({ summary: '获取所有session' })
  async getAllSession(@RequestUserToken() token: string) {
    return this.user.send({ cmd: UserEvents.UserGetAllSession }, token).pipe(
      timeout(1000),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              err.message || '未知错误，请联系管理员',
              err.status || 500,
            ),
        );
      }),
    );
  }

  @Delete('/session/:tokenId')
  @Auth()
  @ApiOperation({ summary: '删除指定的session' })
  async deleteSession(@Param('tokenId') tokenId: string) {
    return this.user.send({ cmd: UserEvents.UserLogout }, tokenId).pipe(
      timeout(1000),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              err.message || '未知错误，请联系管理员',
              err.status || 500,
            ),
        );
      }),
    );
  }

  @Delete('/session/all')
  @Auth()
  @ApiOperation({ summary: '获取所有session' })
  async deleteAllSession() {
    return this.user.send({ cmd: UserEvents.UserLogoutAll }, null).pipe(
      timeout(1000),
      catchError((err) => {
        return throwError(
          () =>
            new HttpException(
              err.message || '未知错误，请联系管理员',
              err.status || 500,
            ),
        );
      }),
    );
  }
}
