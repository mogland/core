/*
 * @FilePath: /nx-core/apps/page-service/src/model/page.model.ts
 * @author: Wibus
 * @Date: 2022-09-24 07:56:12
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 08:35:29
 * Coding With IU
 */

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { modelOptions, prop } from '@typegoose/typegoose';
import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { WriteBaseModel } from '~/shared/model/base.model';
import { IsNilOrString } from '~/shared/utils';

@modelOptions({
  options: {
    customName: 'page',
  },
})
export class PageModel extends WriteBaseModel {
  @prop({ required: true, unique: true, trim: 1, index: true })
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '页面路径' })
  slug?: string;

  @prop({ trim: 1, type: String })
  @IsString()
  @IsOptional()
  @IsNilOrString()
  @ApiProperty({ description: '页面副标题' })
  subtitle?: string | null;

  @prop({ default: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ description: '页面排序' })
  order?: number;
}

export class PartialPageModel extends PartialType(PageModel) {}
