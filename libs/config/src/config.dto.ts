/*
 * @FilePath: /nx-core/libs/config/src/config.dto.ts
 * @author: Wibus
 * @Date: 2022-09-09 20:57:51
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-09 21:00:17
 * Coding With IU
 */

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SEODto {
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
