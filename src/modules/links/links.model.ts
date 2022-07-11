/*
 * @FilePath: /nx-core/src/modules/links/links.model.ts
 * @author: Wibus
 * @Date: 2022-07-11 11:54:02
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-11 12:07:41
 * Coding With IU
 */

import { ApiProperty } from "@nestjs/swagger";
import { modelOptions, prop } from "@typegoose/typegoose";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";
import { BaseModel } from "~/shared/model/base.model";

export enum LinksType {
  Friend, // 好友链接
  Star, // 收藏链接
  Navigate, // 用于导航页面的链接
}

export enum LinksStatus {
  Pass, // 通过
  Audit, // 审核中
  Outdate, // 已过期
  Banned, // 禁止访问
}

export enum RssType {
  rss = "rss", // RSS
  atom = "atom", // Atom
}

@modelOptions({
  options: {
    customName: "links",
  }
})
export class LinksModel extends BaseModel{

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
    }
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
  @Transform(({ value }) => (value === '' ? null : value))
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
  @prop({ default: LinksStatus.Pass })
  status: LinksStatus;

  @prop()
  @IsEmail(undefined, { message: '请输入正确的邮箱！' })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value)) // 如果是空字符串，则转换为null
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
  @IsEnum(RssType, { message: "RSS类型不正确" })
  @prop({ default: RssType.rss })
  rssType?: RssType;

  @IsOptional()
  @IsString()
  @prop()
  rssContent?: string;


  get hide() {
    return this.status === LinksStatus.Audit
  }
  set hide(value) {
    return
  }
}