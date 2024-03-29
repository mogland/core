/*
 * @FilePath: /nx-core/apps/page-service/src/model/post.model.ts
 * @author: Wibus
 * @Date: 2022-09-18 15:02:05
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 07:59:35
 * Coding With IU
 */

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  index,
  modelOptions,
  pre,
  prop,
  Ref,
  Severity,
  plugin,
  DocumentType,
} from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import {
  IsString,
  IsOptional,
  IsMongoId,
  IsBoolean,
  ArrayUnique,
} from 'class-validator';
import { Query } from 'mongoose';
import { CountMixed, WriteBaseModel } from '~/shared/model/base.model';
import { CategoryModel } from './category.model';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

@plugin(aggregatePaginate)
@pre<PostModel>('findOne', autoPopulateCategory)
@pre<PostModel>('find', autoPopulateCategory)
@index({ slug: 1 })
@index({ modified: -1 })
@index({ text: 'text' })
@modelOptions({ options: { customName: 'Post', allowMixed: Severity.ALLOW } })
export class PostModel extends WriteBaseModel {
  @prop({ trim: true, unique: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '文章路径' })
  slug?: string;

  @prop({ trim: true })
  @IsString()
  @ApiProperty({ description: '文章摘要' })
  @IsOptional()
  summary?: string;

  @prop({ ref: () => CategoryModel, required: true })
  @IsMongoId()
  @ApiProperty({ example: '5eb2c62a613a5ab0642f1f7a' })
  @ApiProperty({ description: '文章分类' })
  categoryId: Ref<CategoryModel>;

  @prop({
    ref: () => CategoryModel,
    foreignField: '_id',
    localField: 'categoryId',
    justOne: true,
  })
  @ApiHideProperty()
  public category?: Ref<CategoryModel>;

  @prop({ default: true })
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: '文章署名' })
  copyright?: boolean;

  @prop({
    type: CountMixed,
    default: {
      read: 0,
      like: 0,
    },
    _id: false, // 关闭_id
  })
  @IsOptional()
  @ApiProperty({ description: '文章阅读 & 喜欢数' })
  count?: CountMixed;

  @prop({
    type: String,
  })
  @IsString({ each: true })
  @IsOptional()
  @ArrayUnique()
  @ApiProperty({ description: '文章标签' })
  tags?: string[];

  @prop({
    type: Date,
    default: Date.now,
  })
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '文章创建时间' })
  created?: Date;

  @prop({
    type: Date,
  })
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '文章修改时间' })
  modified?: Date;

  // @prop()
  // @IsOptional()
  // @ApiProperty({ description: "文章作者" })
  // username?: string;
}
function autoPopulateCategory(
  this: Query<
    any,
    DocumentType<PostModel, BeAnObject>,
    {},
    DocumentType<PostModel, BeAnObject>
  >,
  next: () => void,
) {
  this.populate({ path: 'category' });
  next();
}
