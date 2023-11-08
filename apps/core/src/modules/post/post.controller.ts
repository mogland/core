/*
 * @FilePath: /nx-core/apps/core/src/modules/post/post.controller.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:52:34
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 16:10:52
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
import { PostModel } from '~/apps/page-service/src/model/post.model';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { Paginator } from '~/shared/common/decorator/http.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { IsMaster } from '~/shared/common/decorator/role.decorator';
import { PostEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PagerDto } from '~/shared/dto/pager.dto';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

@Controller('post')
@ApiName
export class PostController {
  constructor(@Inject(ServicesEnum.post) private readonly post: ClientProxy) {}

  @Get('/ping')
  @ApiOperation({ summary: '检测服务是否在线' })
  ping() {
    return transportReqToMicroservice(this.post, PostEvents.Ping, {});
  }

  @Get('/')
  @Paginator
  @ApiOperation({ summary: '获取文章列表(附带分页器)' })
  async getPaginate(@Query() query: PagerDto, @IsMaster() isMaster: boolean) {
    return transportReqToMicroservice(this.post, PostEvents.PostsListGet, {
      query,
      isMaster,
    });
  }

  @Get('/:id')
  @ApiOperation({ summary: '通过id获取文章详情' })
  @Auth()
  async getPost(@Param('id') id: string) {
    return transportReqToMicroservice(
      this.post,
      PostEvents.PostGetByMaster,
      id,
    );
  }

  @Get('/:category/:slug')
  @ApiOperation({ summary: '根据分类名与自定义别名获取文章详情' })
  async getByCategoryAndSlug(
    @Param("category") category: string,
    @Param("slug") slug: string,
    @IsMaster() isMaster: boolean,
    @Query('password') password: any,
  ) {
    return transportReqToMicroservice(this.post, PostEvents.PostGet, {
      category,
      slug,
      isMaster,
      password,
    });
  }

  @Post('/')
  @Auth()
  @ApiOperation({ summary: '创建文章' })
  async create(@Body() body: PostModel) {
    return transportReqToMicroservice(this.post, PostEvents.PostCreate, body);
  }

  @Put('/:id')
  @Patch('/:id')
  @Auth()
  @ApiOperation({ summary: '更新文章' })
  async update(@Param('id') id: string, @Body() body: PostModel) {
    return transportReqToMicroservice(this.post, PostEvents.PostPatch, {
      id,
      post: body,
    });
  }

  @Delete('/:id')
  @Auth()
  @ApiOperation({ summary: '删除文章' })
  async delete(@Param("id") id: string) {
    return transportReqToMicroservice(
      this.post,
      PostEvents.PostDelete,
      id,
    );
  }
}
