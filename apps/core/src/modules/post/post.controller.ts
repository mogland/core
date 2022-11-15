/*
 * @FilePath: /mog-core/apps/core/src/modules/post/post.controller.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:52:34
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-15 14:23:11
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
import { CategoryAndSlugDto } from '~/apps/page-service/src/dto/post.dto';
import { PostModel } from '~/apps/page-service/src/model/post.model';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { Paginator } from '~/shared/common/decorator/http.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { IsMaster } from '~/shared/common/decorator/role.decorator';
import { PostEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PagerDto } from '~/shared/dto/pager.dto';

@Controller('post')
@ApiName
export class PostController {
  constructor(@Inject(ServicesEnum.post) private readonly post: ClientProxy) {}

  @Get('/')
  @Paginator
  @ApiOperation({ summary: '获取文章列表(附带分页器)' })
  async getPaginate(@Query() query: PagerDto, @IsMaster() isMaster: boolean) {
    return this.post
      .send({ cmd: PostEvents.PostsListGet }, { query, isMaster })
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

  @Get('/:id')
  @ApiOperation({ summary: '通过id获取文章详情' })
  @Auth()
  async getPost(@Param('id') id: string) {
    return this.post.send({ cmd: PostEvents.PostGet }, id).pipe(
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

  @Get('/:category/:slug')
  @ApiOperation({ summary: '根据分类名与自定义别名获取文章详情' })
  async getByCategoryAndSlug(
    @Param('category') category: string,
    @Param('slug') slug: typeof CategoryAndSlugDto.prototype.slug,
    @IsMaster() isMaster: boolean,
    @Query('password') password: any,
  ) {
    return this.post
      .send({ cmd: PostEvents.PostGet }, { category, slug, isMaster, password })
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

  @Post('/')
  @Auth()
  @ApiOperation({ summary: '创建文章' })
  async create(@Body() body: PostModel) {
    return this.post.send({ cmd: PostEvents.PostCreate }, body).pipe(
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
  @Auth()
  @ApiOperation({ summary: '更新文章' })
  async update(@Param('id') id: string, @Body() body: PostModel) {
    return this.post.send({ cmd: PostEvents.PostPatch }, { id, body }).pipe(
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
  @Auth()
  @ApiOperation({ summary: '删除文章' })
  async delete(@Param('id') id: string) {
    return this.post.send({ cmd: PostEvents.PostDelete }, id).pipe(
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
