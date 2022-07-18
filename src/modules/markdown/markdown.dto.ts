/*
 * @FilePath: /nx-core/src/modules/markdown/markdown.dto.ts
 * @author: Wibus
 * @Date: 2022-07-18 21:25:29
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-18 21:34:19
 * Coding With IU
 */

import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString, ValidateNested } from "class-validator";


export class MarkdownMetaDto {
  @IsString()
  title: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  date: Date

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  updated?: Date

  @IsString({ each: true })
  @IsOptional()
  categories?: string[]

  @IsString({ each: true })
  @IsOptional()
  tags?: string[]

  @IsString()
  slug: string;
}

export class DataDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => MarkdownMetaDto)
  meta?: MarkdownMetaDto;

  @IsString()
  text: string;
}

export class ExportMarkdownDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === '1' || value === 'true')
  @ApiProperty({ description: '是否在 Markdown 文件中导出 YAML meta 信息' })
  yaml?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === '1' || value === 'true')
  @ApiProperty({ description: '输出文件是否使用 slug 命名' })
  slug?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === '1' || value === 'true')
  @ApiProperty({ description: 'Markdown 文件第一行是否显示标题' })
  showTitle?: boolean;
}