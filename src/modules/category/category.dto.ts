/*
 * @FilePath: /nx-core/src/modules/category/category.dto.ts
 * @author: Wibus
 * @Date: 2022-06-08 09:59:52
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-19 16:48:03
 * Coding With IU
 */

import { UnprocessableEntityException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { uniq } from "lodash";
import { IsBooleanOrString } from "~/utils/validator/isBooleanOrString";
import { CategoryType } from "./category.model";


export class SlugorIdDto { // slug or id
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  query?: string
}

export class MultiQueryTagAndCategoryDto { // 查询多个标签和多个分类
  @IsOptional()
  @IsBooleanOrString()
  @Transform(({ value: val }) => {
    if (val === 'true' || val === '1') {
      return true
    } else {
      return val 
    }
  })
  tag?: boolean | string
}

export class MultiCategoriesQueryDto {
  @IsOptional()
  @IsMongoId({
    each: true,
    message: '多分类查询使用逗号分隔, 应为 mongoID',
  })
  @Transform(({ value: v }) => uniq(v.split(',')))
  ids?: Array<string>

  @IsOptional()
  @IsBoolean()
  @Transform((b) => Boolean(b))
  @ApiProperty({ enum: [1, 0] })
  joint?: boolean

  @IsOptional()
  @Transform(({ value: v }: { value: string }) => {
    if (typeof v !== 'string') {
      throw new UnprocessableEntityException('type must be a string')
    }
    switch (v.toLowerCase()) {
      case 'category':
        return CategoryType.Category
      case 'tag':
        return CategoryType.Tag
      default:
        return Object.values(CategoryType).includes(+v)
          ? +v
          : CategoryType.Category
    }
  })
  type: CategoryType
}