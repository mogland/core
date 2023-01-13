/*
 * @FilePath: /nx-core/apps/core/src/modules/page/page.controller.ts
 * @author: Wibus
 * @Date: 2022-09-24 16:01:23
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 16:06:08
 * Coding With IU
 */

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
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { PageModel } from '~/apps/page-service/src/model/page.model';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { Paginator } from '~/shared/common/decorator/http.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { PageEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { MongoIdDto } from '~/shared/dto/id.dto';
import { PagerDto } from '~/shared/dto/pager.dto';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

@Controller('page')
@ApiName
export class PageController {
  constructor(@Inject(ServicesEnum.page) private readonly page: ClientProxy) {}

  @Get('/ping')
  @ApiOperation({ summary: '检测服务是否在线' })
  ping() {
    return transportReqToMicroservice(this.page, PageEvents.Ping, {});
  }

  @Get('/')
  @Paginator
  @ApiOperation({ summary: '获取页面列表' })
  async getPagesSummary(@Query() query: PagerDto) {
    return transportReqToMicroservice(this.page, PageEvents.PageGetAll, query);
  }

  @Get('/:id')
  @ApiOperation({ summary: '通过id获取页面详情' })
  @Auth()
  async getPage(@Param('id') id: string) {
    return transportReqToMicroservice(this.page, PageEvents.PageGet, id);
  }

  @Get('/slug/:slug')
  @ApiOperation({ summary: '使用slug获取页面详情' })
  async getPageBySlug(@Param('slug') slug: string) {
    return transportReqToMicroservice(this.page, PageEvents.PageGet, slug);
  }

  @Post('/create')
  @ApiOperation({ summary: '创建页面' })
  @Auth()
  async create(@Body() body: PageModel) {
    return transportReqToMicroservice(this.page, PageEvents.PageCreate, body);
  }

  @Put('/:id')
  @Patch('/:id')
  @ApiOperation({ summary: '更新页面' })
  @Auth()
  async modify(@Body() body: PageModel, @Param() params: MongoIdDto) {
    return transportReqToMicroservice(this.page, PageEvents.PagePatch, {
      id: params.id,
      body,
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除页面' })
  @Auth()
  async deletePage(@Param() params: MongoIdDto) {
    return transportReqToMicroservice(
      this.page,
      PageEvents.PageDelete,
      params.id,
    );
  }
}
