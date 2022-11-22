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

  private async increateCid(data: CommentsBasicModel) {
    // HACK: MongoDB 不支持自增，所以这里需要手动实现
    const latestComment = await this.commentsBasicModel
      .find()
      .sort({ coid: -1 });
    data.coid = latestComment[0].coid + 1;
    return data;
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
        select: '+ip +agent -children', // 查询字段
        sort: { created: -1 }, // 排序
        populate: [
          // 关联查询
          { path: 'parent', select: '-children' }, // 关联父评论
          { path: 'ref', select: 'title _id slug categoryId' }, // 关联引用对象
        ],
      },
    );
    return queryList;
  }

  async getApprovedComments() {
    return this.commentsBasicModel.find({ status: CommentStatus.Approved });
  }

  async getCommentsByPostId(pid: number) {
    return {
      count: await this.commentsBasicModel.countDocuments({
        status: CommentStatus.Approved,
        pid,
      }),
      data: await this.commentsBasicModel.find({
        pid,
        status: CommentStatus.Approved,
      }),
    };
  }

  async createComment(data: CommentsBasicModel) {
    data = await this.increateCid(data);
    return this.commentsBasicModel.create(data);
  }

  async updateComment(data: CommentsBasicModel) {
    return this.commentsBasicModel.updateOne(
      { coid: data.coid },
      { $set: data },
    );
  }

  async deleteComment(coid: number) {
    const comment = await this.commentsBasicModel.findOne({ coid });
    if (!comment) {
      throw new NotFoundException(ExceptionMessage.CommentNotFound);
    }
    if (comment.parent) {
      await this.commentsBasicModel.updateOne(
        { coid: comment.parent },
        { $pull: { children: coid } },
      );
    }
    if (comment.children.length > 0) {
      await this.commentsBasicModel.deleteMany({
        coid: { $in: comment.children },
      });
    }
    return this.commentsBasicModel.deleteOne({ coid });
  }

  async deleteCommentsByPostId(pid: number) {
    return this.commentsBasicModel.deleteMany({ pid });
  }

  async deleteCommentsByPostIds(pids: number[]) {
    return this.commentsBasicModel.deleteMany({ pid: { $in: pids } });
  }

  async replyComment(data: CommentsBasicModel) {
    data = await this.increateCid(data);
    const parentComment = await this.commentsBasicModel.findOne({
      coid: data.parent,
    });
    if (parentComment) {
      parentComment.children.push(data.coid);
      await this.commentsBasicModel.updateOne(
        { coid: data.parent },
        { $set: parentComment },
      );
    }
    return this.commentsBasicModel.create(data);
  }
}
