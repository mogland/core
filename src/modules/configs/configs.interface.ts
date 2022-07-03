/*
 * @FilePath: /nx-core/src/modules/configs/configs.interface.ts
 * @author: Wibus
 * @Date: 2022-06-25 17:58:56
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-03 08:46:09
 * Coding With IU
 */

import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { JSONSchema } from "class-validator-jsonschema";
import { AdminDto, MailOptionsDto, PluginDto, SiteDto, ThemeDto, UrlsDto } from "./configs.dto";

@JSONSchema({
  title: "设置",
  ps: ['* 敏感字段不显示，后端默认不返回敏感字段，显示为空'],
})
export abstract class ConfigsInterface {
  
  @Type(() => SiteDto)
  @ValidateNested()
  site: Required<SiteDto>;

  @Type(() => UrlsDto)
  @ValidateNested()
  urls: Required<UrlsDto>;

  @Type(() => MailOptionsDto)
  @ValidateNested()
  mailOptions: Required<MailOptionsDto>;

  @Type(() => AdminDto)
  @ValidateNested()
  admin: Required<AdminDto>;

  @Type(() => ThemeDto)
  @ValidateNested()
  theme: Required<ThemeDto>;

  @Type(() => PluginDto)
  @ValidateNested()
  plugins: Required<PluginDto[]>;
}

export type ConfigsInterfaceKeys = keyof ConfigsInterface