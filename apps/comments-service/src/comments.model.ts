import { ApiProperty } from '@nestjs/swagger';
import {
  DocumentType,
  modelOptions,
  pre,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { Query, Types } from 'mongoose';
import { BaseModel } from '~/shared/model/base.model';

function autoPopulateSubComments(
  this: Query<
    any,
    DocumentType<CommentsModel, BeAnObject>,
    {},
    DocumentType<CommentsModel, BeAnObject>
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
  Pending = 'pending', // 待审核
  Approved = 'approved', // 已通过
  Spam = 'spam', // 垃圾评论
  Trash = 'trash', // 回收站
  Private = 'private', // 私密评论
}

export enum CommentType {
  Post = 'post',
  Page = 'page',
}

export enum CommentReactions {
  Like = 'like',
  Dislike = 'dislike',
  Smile = 'smile',
  Angry = 'angry',
  Laugh = 'laugh',
  Confused = 'confused',
  Heart = 'heart',
  Haha = 'haha',
  Cry = 'cry',
  Wow = 'wow',
}

export interface CommentReaction {
  [key: string]: number;
}
@pre<CommentsModel>('findOne', autoPopulateSubComments)
@pre<CommentsModel>('find', autoPopulateSubComments)
@modelOptions({ options: { customName: 'Comment' } })
export class CommentsModel extends BaseModel {
  @prop({ required: true })
  @ApiProperty({ description: '评论关联的 pid ' })
  @IsString()
  pid!: string; // 关联的 pid

  @prop({ ref: () => CommentsModel })
  parent?: Ref<CommentsModel>; // 父评论

  @prop({ ref: () => CommentsModel, type: Types.ObjectId })
  children?: Ref<CommentsModel>[]; // 子评论

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
  @IsEmail()
  email: string;

  @prop({ required: false })
  @IsOptional()
  @IsString()
  @ApiProperty({ description: '评论者网址' })
  url?: string;

  @prop({ required: true, enum: CommentStatus, default: CommentStatus.Pending })
  @ApiProperty({ description: '评论状态' })
  @IsNumber()
  @IsOptional()
  status?: CommentStatus;

  @prop({ required: true, enum: CommentType, default: CommentType.Post })
  @ApiProperty({ description: '评论类型' })
  type: CommentType;

  @prop({ default: 0 })
  commentsIndex?: number; // 评论数量

  @prop()
  key?: string; // 评论key

  @prop({
    default: {
      [CommentReactions.Like]: 0,
      [CommentReactions.Dislike]: 0,
      [CommentReactions.Smile]: 0,
      [CommentReactions.Angry]: 0,
      [CommentReactions.Laugh]: 0,
      [CommentReactions.Confused]: 0,
      [CommentReactions.Heart]: 0,
      [CommentReactions.Haha]: 0,
      [CommentReactions.Cry]: 0,
      [CommentReactions.Wow]: 0,
    },
  })
  @ApiProperty({ description: '评论表情组' })
  reaction?: CommentReaction;
}
