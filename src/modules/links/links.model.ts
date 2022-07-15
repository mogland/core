/*
 * @FilePath: /nx-core/src/modules/links/links.model.ts
 * @author: Wibus
 * @Date: 2022-07-11 11:54:02
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-15 18:16:51
 * Coding With IU
 */

import { ApiProperty } from "@nestjs/swagger";
import { modelOptions, prop } from "@typegoose/typegoose";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";
import { BaseModel } from "~/shared/model/base.model";
import { RssParserType } from "~/utils/rss-parser.utils";

export enum LinksType {
  Friend, // 好友链接
  Star, // 收藏链接
  Navigate, // 用于导航页面的链接
}

export enum LinksStatus {
  Audit, // 审核中
  Pass, // 通过
  Outdate, // 已过期
  Banned, // 禁止访问
}

@modelOptions({
  options: {
    customName: "links",
  },
})
export class LinksModel extends BaseModel {
  @prop({ required: true, trim: true, unique: true })
  @IsString({ message: "链接名称不能为空" })
  @MaxLength(20, { message: "链接名称是不是填错了呀www" })
  name: string;

  @prop({
    required: true,
    trim: true,
    unique: true,
    set: (val: string) => {
      return new URL(val.toLowerCase()).origin; // 将链接转换为小写，并去掉链接中的多余信息
    },
  })
  @IsUrl(
    { require_protocol: true, protocols: ["https"] },
    { message: "只接受 HTTPS 链接哦～" }
  )
  url: string;

  @IsOptional()
  @IsUrl(
    { require_protocol: true, protocols: ["https"] },
    { message: "只接受 HTTPS 链接哦～" }
  )
  @prop({ trim: true })
  @Transform(({ value }) => (value === "" ? null : value))
  @MaxLength(200)
  avatar?: string;

  @IsOptional()
  @prop({ trim: true })
  @MaxLength(50, { message: "链接描述也太长了吧！！" })
  description: string;

  @IsOptional()
  @IsEnum(LinksType, { message: "链接类型不正确" })
  @prop({ default: LinksType.Friend })
  @ApiProperty({ enum: LinksType })
  types?: LinksType;

  @IsOptional()
  @IsEnum(LinksStatus, { message: "链接状态不正确" })
  @prop({ default: LinksStatus.Audit })
  status: LinksStatus;

  @prop()
  @IsEmail(undefined, { message: "请输入正确的邮箱！" })
  @IsOptional()
  @Transform(({ value }) => (value === "" ? null : value)) // 如果是空字符串，则转换为null
  @MaxLength(50)
  email?: string;

  @IsOptional()
  @IsString()
  @prop({ trim: true })
  @IsUrl(
    { require_protocol: true, protocols: ["https"] },
    { message: "只接受 HTTPS RSS 链接哦～" }
  )
  rss?: string;

  @IsOptional()
  @IsEnum(RssParserType, { message: "RSS类型不正确" })
  @prop({ default: RssParserType.RSS })
  rssType?: RssParserType;

  @IsOptional()
  @IsString()
  @prop()
  rssContent?: string;

  @IsOptional()
  @IsBoolean()
  @prop({ default: false })
  rssStatus: boolean;

  get hide() {
    return this.status === LinksStatus.Audit;
  }
  set hide(value) {
    return;
  }
}
