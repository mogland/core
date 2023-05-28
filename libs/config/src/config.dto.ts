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
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ScheduleType,
  AfterSchedule,
} from '~/apps/notification-service/src/schedule.enum';
import { IsCron } from '~/shared/utils/validator/isCron';

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

export class ThemesDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsString()
  @IsOptional()
  package?: string;

  @IsString()
  @IsOptional()
  version?: string;

  @IsOptional()
  @IsString()
  config?: string;

  @IsString()
  @IsNotEmpty()
  path: string;
}

export class ScheduleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsCron()
  @IsNotEmpty()
  cron: string;

  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ScheduleType)
  type: ScheduleType;

  @IsNotEmpty()
  action: any; // 这随着 type 的不同而不同, 用于储存如：url,method,body的数据

  @IsString()
  @IsNotEmpty()
  @IsEnum(AfterSchedule)
  after: AfterSchedule;

  @IsNotEmpty()
  afterAction: any; // 这随着 after 的不同而不同

  @IsArray({ each: true })
  @IsOptional()
  error?: {
    message: string;
    time: Date;
  }[]; // 这里是错误日志，如果有错误，会发送到这里
}
