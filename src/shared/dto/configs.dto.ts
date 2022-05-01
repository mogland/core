/*
 * @FilePath: /GS-server/src/shared/dto/configs.dto.ts
 * @author: Wibus
 * @Date: 2022-05-01 10:40:45
 * @LastEditors: Wibus
 * @LastEditTime: 2022-05-01 10:44:45
 * Coding With IU
 */
import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  ArrayUnique,
  IsBoolean,
  IsEmail,
  IsInt,
  IsIP,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator'

export class SeoDto {
  @IsString({ message: '标题必须是字符串' })
  @IsNotEmpty({ message: '不能为空!!' })
  @IsOptional()
  @ApiProperty({ example: '我的小窝' })
    title: string

  @IsString({ message: '描述信息必须是字符串' })
  @IsNotEmpty({ message: '不能为空!!' })
  @IsOptional()
  @ApiProperty({ example: '欢迎来到我的小窝' })
    description: string

  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: '站点图标必须为正确的网址' })
    icon?: string

  @IsString({ message: '关键字必须为一个数组', each: true })
  @IsOptional()
  @ApiProperty({ example: ['blog', 'mx-space'] })
    keywords?: string[]
}

export class UrlDto {
  @IsUrl({ require_protocol: true })
  @IsOptional()
  @ApiProperty({ example: 'http://127.0.0.1:2323' })
    webUrl: string

  @IsUrl({ require_protocol: true })
  @IsOptional()
  @ApiProperty({ example: 'http://127.0.0.1:9528' })
    adminUrl: string

  @IsUrl({ require_protocol: true })
  @IsOptional()
  @ApiProperty({ example: 'http://127.0.0.1:2333' })
    serverUrl: string
}
class MailOption {
  @IsInt()
  @Transform(({ value: val }) => parseInt(val))
  @IsOptional()
    port: number
  @IsUrl({ require_protocol: false })
  @IsOptional()
    host: string
}
export class MailOptionsDto {
  @IsBoolean()
  @IsOptional()
    enable: boolean
  @IsEmail()
  @IsOptional()
    user: string
  @IsString()
  @IsNotEmpty()
  @IsOptional()
    pass: string

  @ValidateNested()
  @Type(() => MailOption)
  @IsOptional()
    options?: MailOption
}

export class CommentOptionsDto {
  @IsBoolean()
  @IsOptional()
    antiSpam: boolean

  @IsString({ each: true })
  @IsOptional()
  @ArrayUnique()
    spamKeywords?: string[]

  @IsIP(undefined, { each: true })
  @ArrayUnique()
  @IsOptional()
    blockIps?: string[]
  @IsOptional()
  @IsBoolean()
    disableNoChinese?: boolean

}
