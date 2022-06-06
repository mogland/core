/*
 * @FilePath: /nx-server/src/modules/markdown/markdown.dto.ts
 * @author: Wibus
 * @Date: 2022-06-04 16:47:45
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-06 17:25:09
 * Coding With IU
 */
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"
import { IsBoolean, IsOptional } from "class-validator"

export class ExportMarkdownQueryDto {
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === '1' || value === 'true')
  @ApiProperty({ description: 'Markdown 头部输出 YAML 信息' })
    yaml: boolean

  @ApiProperty({ description: '输出文件名为 slug' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === '1' || value === 'true')
    slug: boolean

  @ApiProperty({ description: 'Markdown 第一行显示标题' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === '1' || value === 'true')
    show_title: boolean
}