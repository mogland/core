/*
 * @FilePath: /mog-core/apps/core/src/modules/page/page.controller.ts
 * @author: Wibus
 * @Date: 2022-09-24 16:01:23
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-15 14:18:16
 * Coding With IU
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { timeout, catchError, throwError } from 'rxjs';
import { PageModel } from '~/apps/page-service/src/model/page.model';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { Paginator } from '~/shared/common/decorator/http.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { PageEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PagerDto } from '~/shared/dto/pager.dto';

@Controller('page')
@ApiName
export class PageController {
  constructor(@Inject(ServicesEnum.page) private readonly page: ClientProxy) {}

  @Get('/')
  @Paginator
  @ApiOperation({ summary: '获取页面列表' })
  async getPagesSummary(@Query() query: PagerDto) {
    return this.page.send({ cmd: PageEvents.PageGetAll }, query).pipe(
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

  @Get('/:id')
  @ApiOperation({ summary: '通过id获取页面详情' })
  @Auth()
  async getPage(@Param('id') id: string) {
    return this.page.send({ cmd: PageEvents.PageGetByIdWithMaster }, id).pipe(
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

  @Get('/slug/:slug')
  @ApiOperation({ summary: '使用slug获取页面详情' })
  async getPageBySlug(@Param('slug') slug: string) {
    return this.page.send({ cmd: PageEvents.PageGet }, slug).pipe(
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

  @Post('/create')
  @ApiOperation({ summary: '创建页面' })
  @Auth()
  async create(@Body() body: PageModel) {
    return this.page.send({ cmd: PageEvents.PageCreate }, body).pipe(
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

  @Put('/:id')
  @Patch('/:id')
  @ApiOperation({ summary: '更新页面' })
  @Auth()
  async modify(@Body() body: PageModel, @Param('id') id: string) {
    return this.page.send({ cmd: PageEvents.PagePatch }, { id, body }).pipe(
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

  @Delete('/:id')
  @ApiOperation({ summary: '删除页面' })
  @Auth()
  async deletePage(@Param('id') id: string) {
    return this.page.send({ cmd: PageEvents.PageDelete }, id).pipe(
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
