import { Body, Controller, Get, Patch, Post, Put, Query } from '@nestjs/common';
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

  @Get('/post/:pid')
  @ApiOperation({ summary: '获取文章评论列表' })
  async getCommentsByPostId(@Query('pid') pid: string) {
    return await this.commentsBasicService.getCommentsByPostId(pid);
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

  @Post('/reply')
  @ApiOperation({ summary: '回复评论' })
  async replyComment(
    @Body() data: CommentsBasicModel,
    @IsMaster() master: boolean,
  ) {
    if (!master) {
      data.status = CommentStatus.Pending;
    }
    return await this.commentsBasicService.replyComment(data);
  }

  @Post('/delete')
  @Auth()
  @ApiOperation({ summary: '删除评论' })
  async deleteComment(@Body('coid') coid: string | number) {
    return await this.commentsBasicService.deleteComment(Number(coid));
  }

  @Patch('/status')
  @Auth()
  @ApiOperation({ summary: '修改评论状态' })
  async updateCommentStatus(
    @Body('coid') coid: string | number,
    @Body('status') status: CommentStatus,
  ) {
    return await this.commentsBasicService.model.updateOne(
      { coid },
      { status },
    );
  }

  @Put('/update')
  @Auth()
  @ApiOperation({ summary: '修改评论' })
  async updateComment(@Body() data: CommentsBasicModel) {
    return await this.commentsBasicService.updateComment(data);
  }
}
