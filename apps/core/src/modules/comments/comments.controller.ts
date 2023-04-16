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
import {
  CommentReactions,
  CommentsModel,
} from '~/apps/comments-service/src/comments.model';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { IsMaster } from '~/shared/common/decorator/role.decorator';
import { CommentsEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PagerDto } from '~/shared/dto/pager.dto';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

@Controller('comments')
@ApiName
export class CommentsController {
  constructor(
    @Inject(ServicesEnum.comments) private readonly comments: ClientProxy,
  ) {}

  @Get('/ping')
  @ApiOperation({ summary: '检测服务是否在线' })
  ping() {
    return transportReqToMicroservice(this.comments, CommentsEvents.Ping, {});
  }

  @Get('/')
  @ApiOperation({ summary: '获取评论列表' })
  async getRecentlyComments(
    @Query() query: PagerDto,
    @IsMaster() master: boolean,
  ) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentsGetList,
      { query, master },
    );
  }

  @Get("/:id")
  @ApiOperation({ summary: "根据 ID 获取评论" })
  async getCommentById(@Param("id") id: string) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentGetById,
      id
    );
  }

  @Get('/post/:id')
  @ApiOperation({ summary: '根据 PID 获取评论列表' })
  async getCommentsByPid(
    @Param('id') pid: string,
    @IsMaster() isMaster: boolean,
  ) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentsGetWithPostId,
      { pid, isMaster },
    );
  }

  @Post('/')
  @ApiOperation({ summary: '创建评论' })
  async createComment(
    @Body() data: CommentsModel,
    @IsMaster() master: boolean,
  ) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentCreate,
      { data, master },
    );
  }

  @Post('/reply/:id')
  @ApiOperation({ summary: '回复评论' })
  async replyComment(
    @Param('id') id: string,
    @Body() data: CommentsModel,
    @IsMaster() master: boolean,
  ) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentReply,
      { id, data, master },
    );
  }

  @Delete('/:id')
  @Auth()
  @ApiOperation({ summary: '删除评论' })
  async deleteComment(@Param('id') id: string) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentDeleteByMaster,
      { id },
    );
  }

  @Delete('/pids')
  @Auth()
  @ApiOperation({ summary: '使用 Pid(s) 删除评论, 使用,分割' })
  async deleteCommentByPath(@Query('pids') pids: string) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentsDeleteWithPostId,
      { pids: pids.split(',') },
    );
  }

  @Patch('/:id')
  @Auth()
  @ApiOperation({ summary: '修改评论状态' })
  async updateCommentStatus(
    @Param('id') id: string,
    @Query('status') status: number,
  ) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentUpdateStatusByMaster,
      { id, status },
    );
  }

  @Put('/:id')
  @Auth()
  @ApiOperation({ summary: '修改评论' })
  async updateComment(@Param('id') id: string, @Body() data: CommentsModel) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentPatchByMaster,
      { id, data },
    );
  }

  @Post('/reaction')
  @ApiOperation({ summary: '新增评论反应' })
  async addReactionComment(
    @Body() data: { id: string; reaction: CommentReactions },
  ) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentAddRecaction,
      data,
    );
  }

  @Delete('/reaction')
  @ApiOperation({ summary: '删除评论反应' })
  async removeReactionComment(
    @Body() data: { id: string; reaction: CommentReactions },
  ) {
    return transportReqToMicroservice(
      this.comments,
      CommentsEvents.CommentRemoveRecaction,
      data,
    );
  }
}
