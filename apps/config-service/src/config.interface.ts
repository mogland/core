import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import {
  EmailDto,
  ScheduleDto,
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

  @Type(() => ScheduleDto)
  @ValidateNested()
  schedule: ScheduleDto[];
}

export type ConfigsInterfaceKeys = keyof ConfigsInterface;
