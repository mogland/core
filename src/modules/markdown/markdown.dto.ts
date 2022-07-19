/*
 * @FilePath: /nx-core/src/modules/markdown/markdown.dto.ts
 * @author: Wibus
 * @Date: 2022-07-18 21:25:29
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-19 13:00:23
 * Coding With IU
 */

import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ArticleTypeEnum } from "./markdown.interface";

export class MarkdownMetaDto {
  @IsString()
  @ApiProperty({ description: "文章标题" })
  title: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @ApiProperty({ description: "文章创建时间" })
  date: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  @ApiProperty({ description: "文章修改时间" })
  updated?: Date;

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ description: "文章分类" })
  categories?: string[];

  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ description: "文章标签" })
  tags?: string[];

  @IsString()
  @ApiProperty({ description: "文章路径" })
  slug: string;
}

export class DataDto {
  @ValidateNested()
  @IsOptional()
  @Type(() => MarkdownMetaDto)
  @ApiProperty({ description: "文章元数据" })
  meta?: MarkdownMetaDto;

  @IsString()
  @ApiProperty({ description: "文章内容" })
  text: string;
}

export class ExportMarkdownDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "1" || value === "true")
  @ApiProperty({ description: "是否在 Markdown 文件中导出 YAML meta 信息" })
  yaml?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "1" || value === "true")
  @ApiProperty({ description: "输出文件是否使用 slug 命名" })
  slug?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === "1" || value === "true")
  @ApiProperty({ description: "Markdown 文件第一行是否显示标题" })
  showTitle?: boolean;
}

export class ImportMarkdownDto {
  @IsEnum(ArticleTypeEnum)
  @Transform(({ value }) =>
    typeof value === "string" ? value.toLowerCase() : value
  )
  @ApiProperty({ description: "文章类型" })
  type: ArticleTypeEnum;

  @ValidateNested({ each: true })
  @Type(() => DataDto)
  @ApiProperty({ description: "文章数据" })
  data: DataDto[];
}
