/*
 * @FilePath: /nx-core/libs/config/src/config.dto.ts
 * @author: Wibus
 * @Date: 2022-09-09 20:57:51
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-09 21:00:17
 * Coding With IU
 */

import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SeoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({ each: true })
  @IsOptional()
  keyword?: string[];

  @IsString()
  @IsOptional()
  avatar?: string;
}

export class SiteDto {
  @IsString()
  @IsNotEmpty()
  frontUrl: string;

  @IsString()
  @IsNotEmpty()
  serverUrl: string;
}

export class WebhooksDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsArray({ each: true })
  @IsNotEmpty()
  events: string[]; // 还有一种 `*` 事件，表示所有事件都会触发
}

export class EmailDto {
  @IsString()
  @IsNotEmpty()
  host: string;

  @IsString()
  @IsNotEmpty()
  port: string;

  @IsEmail()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  pass: string;

  @IsBoolean()
  @IsOptional()
  secure?: boolean;
}
