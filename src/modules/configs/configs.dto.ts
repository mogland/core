/*
 * @FilePath: /nx-core/src/modules/configs/configs.dto.ts
 * @author: Wibus
 * @Date: 2022-06-22 07:54:11
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-13 11:11:45
 * Coding With IU
 */

import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";
import {
  halfFieldOption,
  JSONSchemaHalfGirdPlainField,
  JSONSchemaPasswordField,
  JSONSchemaPlainField,
  JSONSchemaToggleField,
} from "./configs.jsonschema.decorator";

@JSONSchema({ title: "站点设置" })
export class SiteDto {
  @IsString({ message: "站点标题必须是字符串" })
  @IsNotEmpty({ message: "站点标题不能为空" })
  @JSONSchemaPlainField("站点标题")
  title: string;

  @IsString({ message: "站点描述必须是字符串" })
  @IsNotEmpty({ message: "站点描述不能为空" })
  @IsOptional()
  @JSONSchemaPlainField("站点描述")
  description: string;

  @IsString({ message: "站点关键字必须是数组", each: true })
  @IsOptional()
  @JSONSchemaPlainField("站点关键字")
  keywords?: string[];
}

@JSONSchema({ title: "URL设置" })
export class UrlsDto {
  @IsString({ message: "网站URL必须是字符串" })
  @IsNotEmpty({ message: "网站URL不能为空" })
  @JSONSchemaPlainField("网站URL")
  @ApiProperty({
    type: String,
    description: "网站URL",
    example: "http://localhost:2333",
  })
  webUrl: string;

  @IsString({ message: "核心服务URL必须是字符串" })
  @IsNotEmpty({ message: "核心服务URL不能为空" })
  @JSONSchemaPlainField("核心服务URL")
  @ApiProperty({
    type: String,
    description: "核心服务URL",
    example: "http://localhost:3000",
  })
  coreUrl: string;

  @IsString({ message: "管理后台URL必须是字符串" })
  @IsNotEmpty({ message: "管理后台URL不能为空" })
  @JSONSchemaPlainField("管理后台URL")
  @ApiProperty({
    type: String,
    description: "管理后台URL",
    example: "http://localhost:2323",
  })
  adminUrl: string;
}

class AuthMailOption {
  @IsOptional()
  @IsEmail()
  @JSONSchemaHalfGirdPlainField("发件邮箱地址")
  user?: string;
  @IsOptional()
  @IsString()
  @Exclude({ toPlainOnly: true })
  @JSONSchemaPasswordField("发件邮箱授权码", halfFieldOption)
  pass?: string;
}

@JSONSchema({ title: "邮件设置" })
export class MailOptionsDto {
  @IsBoolean()
  @IsOptional()
  @JSONSchemaToggleField("开启邮箱服务")
  enable?: boolean;
  @IsUrl({ require_protocol: false })
  @IsOptional()
  @JSONSchemaHalfGirdPlainField("邮箱服务器地址")
  host?: string;
  @IsInt()
  @Transform(({ value: val }) => parseInt(val))
  @IsOptional()
  @JSONSchemaHalfGirdPlainField("邮箱服务器端口")
  port?: number;

  @ValidateNested()
  @Type(() => AuthMailOption)
  @IsOptional()
  @JSONSchema({ "ui:option": { connect: true } })
  auth?: AuthMailOption;
}

@JSONSchema({ title: "后台设置" })
export class AdminDto {
  @IsString({ message: "后台标题必须是字符串" })
  @IsNotEmpty({ message: "后台标题不能为空" })
  @JSONSchemaPlainField("后台标题")
  title: string;

  @IsString()
  @IsOptional()
  background?: string;
}

@JSONSchema({ title: "主题设置" })
export class ThemeDto {

  @IsBoolean()
  @IsOptional()
  @JSONSchemaToggleField("开启主题")
  enable: boolean;

  @IsString({ message: "主题名称必须是字符串" })
  @IsNotEmpty({ message: "主题名称不能为空" })
  @JSONSchemaPlainField("主题名称")
  name: string;

  @IsOptional()
  @JSONSchemaPlainField("主题配置")
  configs: any;
}

class PluginManifest {
  name: string;
  version?: string;
  author?: string;
  description?: string;
  homepage?: string;

  module: string;
  service: string;
  fn?: string = "main";
  lang?: string = "js";
  permission?: string[] = ["read"];
}

export class PluginDto {
  @IsString({ message: "插件名称必须是字符串" })
  @IsNotEmpty({ message: "插件名称不能为空" })
  @JSONSchemaPlainField("插件名称")
  name: string;

  @IsObject({ message: "插件配置必须是对象" })
  @IsOptional()
  // @JSONSchemaPlainField("插件配置")
  config?: object;

  manifest: PluginManifest;

  @IsBoolean()
  @IsOptional()
  @JSONSchemaToggleField("插件启用")
  active: boolean;
}
