import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { CommentsBasicModel, CommentStatus } from './comments.model.basic';

@Injectable()
export class CommentsBasicService {
  constructor(
    @InjectModel(CommentsBasicModel)
    private readonly commentsBasicModel: ModelType<CommentsBasicModel> &
      PaginateModel<CommentsBasicModel & Document>,
  ) {}

  get model() {
    return this.commentsBasicModel;
  }

  async getAllComments(
    { page, size, status } = {
      page: 1,
      size: 10,
      status: CommentStatus.Approved,
    },
  ) {
    const queryList = await this.commentsBasicModel.paginate(
      { status }, // 查询条件
      {
        page, // 当前页
        limit: size, // 每页显示条数
        select: '-children', // 查询字段
        sort: { created: -1 }, // 排序
        populate: [
          // 关联查询
          { path: 'parent', select: '-children' }, // 关联父评论
          // { path: 'ref', select: 'title _id slug categoryId' }, // 关联引用对象
        ],
      },
    );
    return queryList;
  }

  async getCommentsByPath(path: string) {
    return {
      count: await this.commentsBasicModel.countDocuments({
        status: CommentStatus.Approved,
        path,
      }),
      data: await this.commentsBasicModel.find({
        path,
        status: CommentStatus.Approved,
      }),
    };
  }

  async createComment(data: CommentsBasicModel) {
    return this.commentsBasicModel.create(data);
  }

  async updateComment(data: CommentsBasicModel) {
    return this.commentsBasicModel.updateOne({ _id: data.id }, { $set: data });
  }

  async deleteComment(id: string) {
    const comment = await this.commentsBasicModel.findOneAndDelete({ _id: id });
    if (!comment) {
      throw new NotFoundException(ExceptionMessage.CommentNotFound);
    }
    const { parent, children } = comment;
    if (children && children.length) {
      await Promise.all(
        children.map(async (child) => {
          if (child) {
            await this.commentsBasicModel.findByIdAndDelete(child);
          }
        }),
      );
    }

    if (parent) {
      // 更新父评论的评论索引
      const parent = await this.commentsBasicModel.findById(comment.parent);
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
    return this.commentsBasicModel.deleteMany({ path });
  }

  async deleteCommentsByPaths(paths: string[]) {
    return this.commentsBasicModel.deleteMany({ path: { $in: paths } });
  }

  async replyComment(parent: string, data: CommentsBasicModel) {
    const parentComment = await this.commentsBasicModel.findById(parent);
    if (!parentComment) {
      throw new NotFoundException(ExceptionMessage.CommentNotFound);
    }
    const commentsIndex = parentComment.commentsIndex;
    const key = `${parentComment.key}#${commentsIndex}`;
    const comment = await this.commentsBasicModel.create({
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
