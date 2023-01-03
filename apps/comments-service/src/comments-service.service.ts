import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { CommentsModel, CommentStatus } from './comments.model';

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
      status: CommentStatus.Approved,
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

  async getCommentsByPath(path: string, isMaster: boolean) {
    return {
      count: await this.CommentsModel.countDocuments({
        status: isMaster
          ? { $in: [CommentStatus.Approved, CommentStatus.Pending] }
          : CommentStatus.Approved,
        path,
      }),
      data: await this.CommentsModel.find({
        path,
        status: isMaster
          ? { $in: [CommentStatus.Approved, CommentStatus.Pending] }
          : CommentStatus.Approved,
      }),
    };
  }

  async createComment(data: CommentsModel) {
    const pathCount = await this.CommentsModel.countDocuments({
      path: data.path,
    });
    const key = `${data.path}#${pathCount}`;
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
      throw new NotFoundException(ExceptionMessage.CommentNotFound);
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

  async deleteCommentsByPath(path: string) {
    return this.CommentsModel.deleteMany({ path });
  }

  async deleteCommentsByPaths(paths: string[]) {
    return this.CommentsModel.deleteMany({ path: { $in: paths } });
  }

  async replyComment(parent: string, data: CommentsModel) {
    const parentComment = await this.CommentsModel.findById(parent);
    if (!parentComment) {
      throw new NotFoundException(ExceptionMessage.CommentNotFound);
    }
    data.path = parentComment.path; // 防止恶意修改，强制使用父评论的path
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
}
