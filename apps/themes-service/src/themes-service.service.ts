import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '~/libs/config/src';
import { ThemeDto } from '~/libs/config/src/config.dto';
import { consola } from '~/shared/global/consola.global';

@Injectable()
export class ThemesServiceService {
  private readonly logger: Logger;
  private themes: ThemeDto[];
  constructor(private readonly configService: ConfigService) {
    this.logger = new Logger(ThemesServiceService.name);
    this.configService.get('themes').then((themes) => {
      this.themes = themes;
      consola.success(
        `主题服务已启动，共加载了${themes?.length || 0}个主题配置`,
      );
    });
  }
}
