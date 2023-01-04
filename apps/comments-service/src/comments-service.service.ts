import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import {
  CommentReactions,
  CommentsModel,
  CommentStatus,
} from './comments.model';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(CommentsModel)
    private readonly CommentsModel: ModelType<CommentsModel> &
      PaginateModel<CommentsModel & Document>,
  ) {}

  get model() {
    return this.CommentsModel;
  }

  async getAllComments(
    { page, size, status } = {
      page: 1,
      size: 10,
      status: CommentStatus.Approved as CommentStatus | number,
    },
  ) {
    const queryList = await this.CommentsModel.paginate(
      { status }, // 查询条件
      {
        page, // 当前页
        limit: size, // 每页显示条数
        select: '-children', // 查询字段
        sort: { created: -1 }, // 排序
        populate: [
          // 关联查询
          { path: 'parent', select: '-children' }, // 关联父评论
        ],
      },
    );
    return queryList;
  }

  async getCommentsByPid(pid: string, isMaster: boolean) {
    return {
      count: await this.CommentsModel.countDocuments({
        status: isMaster
          ? { $in: [CommentStatus.Approved, CommentStatus.Pending] }
          : CommentStatus.Approved,
        pid,
      }),
      data: await this.CommentsModel.find({
        pid,
        status: isMaster
          ? { $in: [CommentStatus.Approved, CommentStatus.Pending] }
          : CommentStatus.Approved,
      }),
    };
  }

  async createComment(data: CommentsModel) {
    const pidCount = await this.CommentsModel.countDocuments({
      pid: data.pid,
    });
    const key = `${data.pid}#${pidCount}`;
    return this.CommentsModel.create({
      ...data,
      key,
    });
  }

  async updateComment(id: string, data: CommentsModel) {
    delete data.commentsIndex; // 评论索引不允许修改
    return this.CommentsModel.updateOne({ _id: id }, { $set: data });
  }

  async deleteComment(id: string) {
    const comment = await this.CommentsModel.findOneAndDelete({ id });
    if (!comment) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: ExceptionMessage.CommentNotFound,
      });
    }
    const { parent, children } = comment;
    if (children && children.length) {
      await Promise.all(
        children.map(async (child) => {
          if (child) {
            await this.CommentsModel.findByIdAndDelete(child);
          }
        }),
      );
    }

    if (parent) {
      // 更新父评论的评论索引
      const parent = await this.CommentsModel.findById(comment.parent);
      if (parent) {
        await parent.updateOne({
          $pull: {
            children: comment._id,
          },
          $inc: {
            commentsIndex: -1,
          },
        });
      }
    }
  }

  async deleteCommentsByPid(pid: string) {
    return this.CommentsModel.deleteMany({ pid });
  }

  async deleteCommentsByPids(pids: string[]) {
    return this.CommentsModel.deleteMany({ pid: { $in: pids } });
  }

  async replyComment(parent: string, data: CommentsModel) {
    const parentComment = await this.CommentsModel.findById(parent);
    if (!parentComment) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: ExceptionMessage.CommentNotFound,
      });
    }
    data.pid = parentComment.pid; // 防止恶意修改，强制使用父评论的pid
    const commentsIndex = parentComment.commentsIndex;
    const key = `${parentComment.key || 0}#${commentsIndex}`;
    const comment = await this.CommentsModel.create({
      ...data,
      key,
    });
    await parentComment.updateOne({
      $push: {
        children: comment._id,
      },
      $inc: {
        commentsIndex: 1,
      },
    });
    return comment;
  }

  async handleCommentReaction(
    id: string,
    reaction: CommentReactions,
    isAdd: boolean,
  ) {
    const comment = this.CommentsModel.findById(id);
    if (!comment) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: ExceptionMessage.CommentNotFound,
      });
    }
    // 验证 reaction 是否合法
    if (!Object.values(CommentReactions).includes(reaction)) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: ExceptionMessage.InvalidCommentReaction,
      });
    }
    const update = isAdd
      ? { $inc: { [`reaction.${reaction}`]: 1 } }
      : { $inc: { [`reaction.${reaction}`]: -1 } };
    return this.CommentsModel.updateOne({ _id: id }, update);
  }
}
