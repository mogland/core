import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  index,
  modelOptions,
  plugin,
  prop,
  Severity,
} from '@typegoose/typegoose';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsObject,
} from 'class-validator';
import LeanId from 'mongoose-lean-id';
import { default as mongooseLeanVirtuals } from 'mongoose-lean-virtuals';
import Paginate from 'mongoose-paginate-v2';
import { IsNilOrString } from '../utils';
import { ImageModel } from './image.model';

@plugin(mongooseLeanVirtuals)
@plugin(LeanId)
@plugin(Paginate)
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: 'created',
      updatedAt: false,
    },
  },
})
@index({ created: -1 })
@index({ created: 1 })
export class BaseModel {
  @ApiHideProperty()
  created?: Date;

  @ApiHideProperty()
  id?: string;

  static get protectedKeys() {
    return ['created', 'id', '_id'];
  }
}
export abstract class BaseCommentIndexModel extends BaseModel {
  @prop({ default: 0 })
  @ApiHideProperty()
  commentsIndex?: number;

  @prop({ default: true })
  @IsBoolean()
  @IsOptional()
  allowComment?: boolean;

  static get protectedKeys() {
    return ['commentsIndex'].concat(super.protectedKeys);
  }
}

@modelOptions({
  options: { allowMixed: Severity.ALLOW },
})
export class WriteBaseModel extends BaseCommentIndexModel {
  @prop({ trim: true, index: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '标题' })
  title: string;

  @prop({ trim: true })
  @IsString()
  @ApiProperty({ description: '内容' })
  text: string;

  @prop({ type: ImageModel })
  @ApiHideProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ImageModel)
  @ApiProperty({ description: '内容图片元数据' })
  images?: ImageModel[];

  @prop({ default: null, type: Date })
  @ApiHideProperty()
  @IsOptional()
  @ApiProperty({ description: '内容修改时间' })
  modified?: Date | null;

  @prop()
  @ApiProperty({ description: '自定义字段' })
  @IsOptional()
  @IsObject()
  fields?: BeAnObject;

  @prop({ type: String, default: null })
  @IsOptional()
  @IsNilOrString()
  @ApiProperty({ description: '加密密码（若填写则启动加密）' })
  password?: string | null;

  @prop({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: '是否隐藏' })
  hide?: boolean;

  @prop({ type: Boolean, default: true })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: '是否公开在RSS输出' })
  rss?: boolean;

  static get protectedKeys() {
    return super.protectedKeys;
  }
}
@modelOptions({
  schemaOptions: { id: false, _id: false },
  options: { customName: 'count' },
})
export class CountMixed {
  @prop({ default: 0 })
  read?: number;

  @prop({ default: 0 })
  like?: number;
}
