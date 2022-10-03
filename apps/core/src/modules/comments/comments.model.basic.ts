/*
 * @FilePath: /mog-core/apps/core/src/modules/comments/comments.model.basic.ts
 * @author: Wibus
 * @Date: 2022-10-03 16:56:56
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-03 21:49:58
 * Coding With IU
 */

import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { PageModel } from '~/apps/page-service/src/model/page.model';
import { PostModel } from '~/apps/page-service/src/model/post.model';
import { BaseModel } from '~/shared/model/base.model';

enum CommentStatus {
  Pending = 'pending', // 待审核
  Approved = 'approved', // 已通过
  Spam = 'spam', // 垃圾评论
  Trash = 'trash', // 回收站
}

export enum CommentType {
  Post = 'post',
  Page = 'page',
}

@modelOptions({ options: { customName: 'Comment' } })
export class CommentsBasicModel extends BaseModel {
  @prop({ required: true })
  @IsString()
  @ApiProperty({ description: '评论内容' })
  text!: string;

  @prop({ required: true })
  @IsString()
  @ApiProperty({ description: '评论者' })
  author: string;

  @prop({ required: true })
  @IsString()
  @ApiProperty({ description: '评论者邮箱' })
  email: string;

  @prop({ required: false })
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '评论者网址' })
  url?: string;

  @prop({ required: true, enum: CommentStatus })
  @ApiProperty({ description: '评论状态' })
  @IsString()
  status: CommentStatus;

  @prop({ required: true })
  @IsString()
  @ApiProperty({ description: '评论所属文章或页面' })
  parent: string;

  @prop({ required: true, enum: CommentType, default: CommentType.Post })
  @ApiProperty({ description: '评论类型' })
  type: CommentType;

  @prop({ ref: () => CommentsBasicModel, type: Types.ObjectId })
  children?: Ref<CommentsBasicModel>[]; // 子评论

  @prop({ default: 1 })
  commentsIndex?: number; // 评论顺序

  @prop()
  key?: string; // 评论key

  @prop({ refPath: 'type' })
  ref: Ref<PostModel | PageModel>; // 引用的文章或页面

  @prop({
    ref: () => PostModel, // 评论的文章
    foreignField: '_id', // 指定外键字段
    localField: 'ref', // 指定当前字段
    justOne: true, // 只查询一条
  })
  public post: Ref<PostModel>;

  @prop({
    ref: () => PageModel,
    foreignField: '_id',
    localField: 'ref',
    justOne: true,
  })
  public page: Ref<PageModel>;
}
