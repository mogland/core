import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import PKG from '../../../package.json';
import { ApiOperation } from '@nestjs/swagger';
import { isDev } from '@shared/global/env.global';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import { NotificationEvents } from '~/shared/constants/event.constant';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(ServicesEnum.notification)
    private readonly notification: ClientProxy,
  ) {}

  @Get(['/', '/info'])
  @ApiOperation({ summary: '获取服务端版本等信息' })
  async appInfo() {
    return {
      name: PKG.name,
      author: PKG.author,
      version: isDev ? 'dev' : PKG.version,
      homepage: PKG.homepage,
      issues: PKG.issues,
    };
  }

  @Get(['/ping'])
  @ApiOperation({ summary: '测试接口是否存活' })
  ping(): 'pong' {
    return 'pong';
  }

  @Get(['/notification/ping'])
  @ApiOperation({ summary: '测试通知服务是否存活' })
  pingNotification() {
    return transportReqToMicroservice(
      this.notification,
      NotificationEvents.Ping,
      {},
    );
  }

  // @Get('/*')
  // @ApiOperation({ summary: '自定义 Path (GET)' })
  // async customGetPath(@Query() query: any, @Param() param: any) {
  //   return this.appService.transformCustomPath('GET', query, param);
  // }

  // @Post('/*')
  // @ApiOperation({ summary: '自定义 Path (POST)' })
  // async customPostPath(
  //   @Query() query: any,
  //   @Param() param: any,
  //   @Body() body: any,
  // ) {
  //   return this.appService.transformCustomPath('POST', query, param, body);
  // }

  // @Put('/*')
  // @ApiOperation({ summary: '自定义 Path (PUT)' })
  // async customPutPath(
  //   @Query() query: any,
  //   @Param() param: any,
  //   @Body() body: any,
  // ) {
  //   return this.appService.transformCustomPath('PUT', query, param, body);
  // }

  // @Patch('/*')
  // @ApiOperation({ summary: '自定义 Path (PATCH)' })
  // async customPatchPath(
  //   @Query() query: any,
  //   @Param() param: any,
  //   @Body() body: any,
  // ) {
  //   return this.appService.transformCustomPath('PATCH', query, param, body);
  // }

  // @Delete('/*')
  // @ApiOperation({ summary: '自定义 Path (DELETE)' })
  // async customDeletePath(@Query() query: any, @Param() param: any) {
  //   return this.appService.transformCustomPath('DELETE', query, param);
  // }
}
