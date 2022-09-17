/*
 * @FilePath: /nx-core/apps/category-service/src/category.dto.ts
 * @author: Wibus
 * @Date: 2022-09-17 18:18:04
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-17 18:24:28
 * Coding With IU
 */

import { UnprocessableEntityException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, IsMongoId } from 'class-validator';
import { uniq } from 'lodash';
import { IsBooleanOrString } from '~/shared/utils';
import { CategoryType } from './category.model';

/**
 * SlugorIdDto 用于根据 slug 或 id 查询
 */
export class SlugorIdDto {
  // slug or id
  @IsString()
  @IsOptional()
  @ApiProperty()
  query?: string;
}

export class MultiQueryTagAndCategoryDto {
  // 查询多个标签和多个分类
  @IsOptional()
  @IsBooleanOrString()
  @Transform(({ value: val }) => {
    if (val === 'true' || val === '1') {
      return true;
    } else {
      return val;
    }
  })
  tag?: boolean | string;
}

/**
 * 获取多个分类
 */
export class MultiCategoriesQueryDto {
  @IsOptional()
  @IsMongoId({
    each: true,
    message: '多分类查询使用逗号分隔, 应为 mongoID',
  })
  @Transform(({ value: v }) => uniq(v.split(',')))
  @ApiProperty({ description: '分类id' })
  ids?: Array<string>;

  @IsOptional()
  @IsBoolean()
  @Transform((b) => Boolean(b))
  @ApiProperty({ enum: [1, 0], description: '是否查询分类下的文章' })
  joint?: boolean;

  @IsOptional()
  @Transform(({ value: v }: { value: string }) => {
    if (typeof v !== 'string') {
      throw new UnprocessableEntityException('type must be a string');
    }
    switch (v.toLowerCase()) {
      case 'category':
        return CategoryType.Category;
      case 'tag':
        return CategoryType.Tag;
      default:
        return Object.values(CategoryType).includes(+v)
          ? +v
          : CategoryType.Category;
    }
  })
  @ApiProperty({ enum: CategoryType, description: '分类类型' })
  type: CategoryType;
}
