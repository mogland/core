/*
 * @FilePath: /nx-core/apps/category-service/src/category.model.ts
 * @author: Wibus
 * @Date: 2022-09-17 18:04:22
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-17 18:11:42
 * Coding With IU
 */

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { modelOptions, DocumentType, prop, index } from '@typegoose/typegoose';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { BaseModel } from '~/shared/model/base.model';

export type CategoryDocument = DocumentType<CategoryModel>;

export enum CategoryType {
  Category,
  Tag,
}

@index({ slug: -1 })
@modelOptions({ options: { customName: 'Category' } })
export class CategoryModel extends BaseModel {
  @prop({
    trim: true, // 去除空格
    unique: true, // 唯一
    required: true, // 必填
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '分类名' })
  name!: string;

  @prop({
    default: CategoryType.Category, // 默认为分类
  })
  @IsEnum(CategoryType)
  @IsOptional()
  @ApiProperty({ description: '分类类型' })
  type?: CategoryType;

  @prop({ unique: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '分类路径' })
  slug!: string;

  @prop()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '分类图标' })
  icon?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: '分类描述' })
  description?: string;
}

// 定义一个 Partial 类型 来包含所有的属性
export class PartialCategoryModel extends PartialType(CategoryModel) {}
