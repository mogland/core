/*
 * @FilePath: /mog-core/apps/core/src/modules/comments/comments.model.basic.ts
 * @author: Wibus
 * @Date: 2022-10-03 16:56:56
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-04 12:59:19
 * Coding With IU
 */

import { ApiProperty } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { BaseModel } from '~/shared/model/base.model';

export enum CommentStatus {
  Pending = 'pending', // 待审核
  Approved = 'approved', // 已通过
  Spam = 'spam', // 垃圾评论
  Trash = 'trash', // 回收站
}

export enum CommentType {
  Post = 'post',
  Page = 'page',
}

// 因为要兼容其他的博客系统，所以这里的字段并不做关联
@modelOptions({ options: { customName: 'Comment' } })
export class CommentsBasicModel extends BaseModel {
  @prop({ index: true, unique: true, required: true })
  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: '评论 ID，需要后端方法中实现自增' })
  coid: number;

  @prop({ required: true })
  @ApiProperty({ description: '评论关联文章或页面的 pid ' })
  @IsNumber()
  pid: number;

  @prop({ type: Number })
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '父评论' })
  parent?: number;

  @prop({ type: Number })
  @ApiProperty({ description: '子评论' })
  @IsOptional()
  children: number[] | any[];

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

  @prop({ required: true, enum: CommentType, default: CommentType.Post })
  @ApiProperty({ description: '评论类型' })
  type: CommentType;

  @prop({ default: 1 })
  commentsIndex?: number; // 评论顺序

  @prop()
  key?: string; // 评论key
}
