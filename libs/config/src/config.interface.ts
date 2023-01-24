/*
 * @FilePath: /nx-core/libs/config/src/config.interface.ts
 * @author: Wibus
 * @Date: 2022-09-08 21:34:16
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-09 21:12:50
 * Coding With IU
 */

import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  EmailDto,
  SeoDto,
  SiteDto,
  ThemesDto,
  WebhooksDto,
} from './config.dto';

export abstract class ConfigsInterface {
  @Type(() => SeoDto)
  @ValidateNested()
  seo: SeoDto;

  @Type(() => SiteDto)
  @ValidateNested()
  site: SiteDto;

  @Type(() => Array<WebhooksDto>)
  @ValidateNested()
  webhooks: WebhooksDto[];

  @Type(() => EmailDto)
  @ValidateNested()
  email: EmailDto;

  @Type(() => ThemesDto)
  @ValidateNested()
  themes: ThemesDto[];
}

export type ConfigsInterfaceKeys = keyof ConfigsInterface;
