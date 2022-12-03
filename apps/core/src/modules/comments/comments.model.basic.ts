/*
 * @FilePath: /mog-core/apps/core/src/modules/comments/comments.model.basic.ts
 * @author: Wibus
 * @Date: 2022-10-03 16:56:56
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-22 14:23:26
 * Coding With IU
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  DocumentType,
  modelOptions,
  pre,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { IsOptional, IsString } from 'class-validator';
import { Query, Types } from 'mongoose';
import { BaseModel } from '~/shared/model/base.model';

function autoPopulateSubComments(
  this: Query<
    any,
    DocumentType<CommentsBasicModel, BeAnObject>,
    {},
    DocumentType<CommentsBasicModel, BeAnObject>
  >,
  next: () => void,
) {
  this.populate({
    options: { sort: { created: -1 } },
    path: 'children',
  });
  next();
}

export enum CommentStatus {
  Pending, // 待审核
  Approved, // 已通过
  Spam, // 垃圾评论
  Trash, // 回收站
}

export enum CommentType {
  Post = 'post',
  Page = 'page',
}

@pre<CommentsBasicModel>('findOne', autoPopulateSubComments)
@pre<CommentsBasicModel>('find', autoPopulateSubComments)
@modelOptions({ options: { customName: 'Comment' } })
export class CommentsBasicModel extends BaseModel {
  @prop({ required: true })
  @ApiProperty({ description: '评论关联文章或页面的 path ' })
  @IsString()
  path: string;

  @prop({ ref: () => CommentsBasicModel })
  parent?: Ref<CommentsBasicModel>; // 父评论

  @prop({ ref: () => CommentsBasicModel, type: Types.ObjectId })
  children?: Ref<CommentsBasicModel>[]; // 子评论

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

  // @prop({ required: true, enum: CommentType, default: CommentType.Post })
  // @ApiProperty({ description: '评论类型' })
  // type: CommentType;

  @prop({ default: 0 })
  commentsIndex?: number; // 评论数量

  @prop()
  key?: string; // 评论key
}
