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
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { IsMaster } from '~/shared/common/decorator/role.decorator';
import { PagerDto } from '~/shared/dto/pager.dto';
import { transformDataToPaginate } from '~/shared/transformers/paginate.transformer';
import { CommentsBasicService } from './comments.basic.service';
import { CommentsBasicModel, CommentStatus } from './comments.model.basic';

@Controller('comments')
@ApiName
export class CommentsController {
  constructor(private readonly commentsBasicService: CommentsBasicService) {}

  @Get('/')
  @ApiOperation({ summary: '获取评论列表' })
  async getRecentlyComments(
    @Query() query: PagerDto,
    @IsMaster() master: boolean,
  ) {
    const { size = 10, page = 1, status = CommentStatus.Approved } = query;
    return transformDataToPaginate(
      await this.commentsBasicService.getAllComments({
        size,
        page,
        status: master ? status : CommentStatus.Approved,
      }),
    );
  }

  @Get('/page')
  @ApiOperation({ summary: '获取某一页面的评论列表' })
  async getCommentsByPath(
    @Query('path') path: string,
    @IsMaster() isMaster: boolean,
  ) {
    return await this.commentsBasicService.getCommentsByPath(path, isMaster);
  }

  @Post('/')
  @ApiOperation({ summary: '创建评论' })
  async createComment(
    @Body() data: CommentsBasicModel,
    @IsMaster() master: boolean,
  ) {
    if (!master) {
      data.status = CommentStatus.Pending;
    }
    return await this.commentsBasicService.createComment(data);
  }

  @Post('/reply/:id')
  @ApiOperation({ summary: '回复评论' })
  async replyComment(
    @Param('id') id: string,
    @Body() data: CommentsBasicModel,
    @IsMaster() master: boolean,
  ) {
    if (!master) {
      data.status = CommentStatus.Pending;
    }
    return await this.commentsBasicService.replyComment(id, data);
  }

  @Delete('/')
  @Auth()
  @ApiOperation({ summary: '删除评论' })
  async deleteComment(@Query('id') id: string) {
    return await this.commentsBasicService.deleteComment(id);
  }

  @Delete('/path')
  @Auth()
  @ApiOperation({ summary: '使用 Path(s) 删除评论' })
  async deleteCommentByPath(@Query('path') path: string) {
    const slice = path.split(',');
    if (slice.length > 1)
      return await this.commentsBasicService.deleteCommentsByPaths(slice);
    return await this.commentsBasicService.deleteCommentsByPath(path);
  }

  @Patch('/status')
  @Auth()
  @ApiOperation({ summary: '修改评论状态' })
  async updateCommentStatus(
    @Body('id') id: string,
    @Body('status') status: number,
    // TODO: 检测 status 是否合法
  ) {
    return await this.commentsBasicService.model.updateOne(
      { _id: id },
      { status },
    );
  }

  @Put('/')
  @Auth()
  @ApiOperation({ summary: '修改评论' })
  async updateComment(
    @Body('id') id: string,
    @Body() data: CommentsBasicModel,
  ) {
    return await this.commentsBasicService.updateComment(id, data);
  }
}
