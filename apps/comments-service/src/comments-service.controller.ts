import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommentsEvents } from '~/shared/constants/event.constant';
import { PagerDto } from '~/shared/dto/pager.dto';
import { transformDataToPaginate } from '~/shared/transformers/paginate.transformer';
import { CommentsService } from './comments-service.service';
import {
  CommentReactions,
  CommentsModel,
  CommentStatus,
} from './comments.model';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern({ cmd: CommentsEvents.CommentsGetList })
  async getRecentlyComments(input: { query: PagerDto; master: boolean }) {
    const {
      size = 10,
      page = 1,
      status = CommentStatus.Approved,
    } = input.query;
    return transformDataToPaginate(
      await this.commentsService.getAllComments({
        size,
        page,
        status: input.master ? status : CommentStatus.Approved,
      }),
    );
  }

  @MessagePattern({ cmd: CommentsEvents.CommentsGetWithPostId })
  async getCommentsByPath(input: { pid: string; master: boolean }) {
    return await this.commentsService.getCommentsByPid(input.pid, input.master);
  }

  @MessagePattern({ cmd: CommentsEvents.CommentCreate })
  async createComment(input: { data: CommentsModel; master: boolean }) {
    if (!input.master) {
      input.data.status = CommentStatus.Pending;
    }
    return await this.commentsService.createComment(input.data);
  }

  @MessagePattern({ cmd: CommentsEvents.CommentReply })
  async replyComment(input: {
    id: string;
    data: CommentsModel;
    master: boolean;
  }) {
    if (!input.master) {
      input.data.status = CommentStatus.Pending;
    }
    return await this.commentsService.replyComment(input.id, input.data);
  }

  @MessagePattern({ cmd: CommentsEvents.CommentDeleteByMaster })
  async deleteComment(id: string) {
    return await this.commentsService.deleteComment(id);
  }

  @MessagePattern({ cmd: CommentsEvents.CommentsDeleteWithPostId })
  async deleteCommentsByPid(pids: string[]) {
    return await this.commentsService.deleteCommentsByPids(pids);
  }

  @MessagePattern({ cmd: CommentsEvents.CommentUpdateStatusByMaster })
  async updateCommentStatus(input: { id: string; status: CommentStatus }) {
    return await this.commentsService.model.updateOne(
      { _id: input.id },
      { status: input.status },
    );
  }

  @MessagePattern({ cmd: CommentsEvents.CommentPatchByMaster })
  async patchComment(input: { id: string; data: CommentsModel }) {
    return await this.commentsService.updateComment(input.id, input.data);
  }

  @MessagePattern({ cmd: CommentsEvents.CommentAddRecaction })
  async addRecaction(input: { id: string; reaction: CommentReactions }) {
    return await this.commentsService.handleCommentReaction(
      input.id,
      input.reaction,
      true,
    );
  }

  @MessagePattern({ cmd: CommentsEvents.CommentRemoveRecaction })
  async removeRecaction(input: { id: string; reaction: CommentReactions }) {
    return await this.commentsService.handleCommentReaction(
      input.id,
      input.reaction,
      false,
    );
  }
}
