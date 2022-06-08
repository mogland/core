/*
 * @FilePath: /nx-core/src/modules/category/category.dto.ts
 * @author: Wibus
 * @Date: 2022-06-08 09:59:52
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-08 16:31:28
 * Coding With IU
 */

import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
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
  @Transform(({ value: val }) => { // 转换为数组
    if (val === 'true' || val === '1') {
      return true
    } else {
      return val 
    }
  })
  tag?: boolean | string
}

export class MultiCategoryQueryDto {
  ids?: Array<string>
  joint?: boolean
  type: CategoryType
}