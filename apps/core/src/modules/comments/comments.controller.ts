import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CommentsModel } from '~/apps/comments-service/src/comments.model';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { IsMaster } from '~/shared/common/decorator/role.decorator';
import { PagerDto } from '~/shared/dto/pager.dto';

@Controller('comments')
@ApiName
export class CommentsController {
  constructor() {}

  @Get('/')
  @ApiOperation({ summary: '获取评论列表' })
  async getRecentlyComments(
    @Query() query: PagerDto,
    @IsMaster() master: boolean,
  ) {}

  @Get('/page')
  @ApiOperation({ summary: '获取某一页面的评论列表' })
  async getCommentsByPath(
    @Query('path') path: string,
    @IsMaster() isMaster: boolean,
  ) {}

  @Post('/')
  @ApiOperation({ summary: '创建评论' })
  async createComment(
    @Body() data: CommentsModel,
    @IsMaster() master: boolean,
  ) {}

  @Post('/reply/:id')
  @ApiOperation({ summary: '回复评论' })
  async replyComment(
    @Param('id') id: string,
    @Body() data: CommentsModel,
    @IsMaster() master: boolean,
  ) {}

  @Delete('/')
  @Auth()
  @ApiOperation({ summary: '删除评论' })
  async deleteComment(@Query('id') id: string) {}

  @Delete('/path')
  @Auth()
  @ApiOperation({ summary: '使用 Path(s) 删除评论' })
  async deleteCommentByPath(@Query('path') path: string) {}

  @Patch('/status')
  @Auth()
  @ApiOperation({ summary: '修改评论状态' })
  async updateCommentStatus(
    @Body('id') id: string,
    @Body('status') status: number,
    // TODO: 检测 status 是否合法
  ) {}

  @Put('/')
  @Auth()
  @ApiOperation({ summary: '修改评论' })
  async updateComment(@Body('id') id: string, @Body() data: CommentsModel) {}
}
