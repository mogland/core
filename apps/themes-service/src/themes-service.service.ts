import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';
import { ConfigService } from '~/libs/config/src';
import { ThemeDto } from '~/libs/config/src/config.dto';
import { THEME_DIR } from '~/shared/constants/path.constant';
import { consola } from '~/shared/global/consola.global';
import yaml from 'js-yaml';
import {
  ThemeConfig,
  ThemeConfigItemAll,
  ThemeConfigItemSelect,
  ThemeConfigType,
} from './theme.interface';
import fs from 'fs';

@Injectable()
export class ThemesServiceService {
  private env: {
    theme: string | undefined;
    [key: string]: any;
  };
  private themesConfig: ThemeDto[];
  private themes: ThemeDto[];
  private dir: any[] = [];
  constructor(private readonly configService: ConfigService) {
    this.env = JSON.parse(process.env.MOG_PRIVATE_INNER_ENV || '{}')?.theme || {
      theme: undefined,
    };

    this.configService
      .get('themes')
      .then((themes) => {
        this.themesConfig = themes;
        consola.info(`共加载了${themes?.length || 0}个主题配置`);
      })
      .then(() => {
        consola.info(`共检测到 ${fs.readdirSync(THEME_DIR).length} 个主题`);
      })
      .then(() => {
        fs.readdirSync(THEME_DIR).forEach((theme) => {
          this.validateTheme(theme, false);
        });
      })
      .then(() => {
        consola.success(
          `合法主题检测完毕，共检测到 ${this.dir.length} 个合法主题`,
        );
      });

    this._getAllThemes().then((themes) => {
      this.themes = themes;
    });

    this.trackThemeChange();
  }

  /**
   * 追踪活动主题修改
   */
  async trackThemeChange() {
    if (this.env.theme) {
      fs.watchFile(join(THEME_DIR, this.env.theme, 'config.yaml'), () => {
        this.validateTheme(this.env.theme!);
      });
    }
  }

  /**
   * 修改活动主题
   */
  async setENV(theme: string) {
    this.env.theme = theme;
    process.env.MOG_PRIVATE_INNER_ENV = JSON.stringify({
      ...this.env,
      theme,
    });
  }

  /**
   * 验证主题合法性
   */
  validateTheme(theme: string, error = true) {
    try {
      if (!fs.existsSync(join(THEME_DIR, theme))) {
        throw new InternalServerErrorException(`主题不存在`);
      }
      try {
        fs.accessSync(path.join(THEME_DIR, theme), fs.constants.R_OK);
      } catch (e) {
        throw new InternalServerErrorException(`主题目录无读取权限`);
      }
      let config: ThemeConfig;
      try {
        const configString = fs.readFileSync(
          join(THEME_DIR, theme, 'config.yaml'),
          'utf-8',
        );
        config = yaml.load(configString) as ThemeConfig;
      } catch (e) {
        throw new InternalServerErrorException(
          `主题配置文件读取失败, 请检查文件是否存在`,
        );
      }
      if (!config?.configs) {
        throw new InternalServerErrorException(
          `主题配置文件格式错误, configs 字段不存在`,
        );
      }
      config.configs.forEach((config) => {
        if (!config?.name) {
          throw new InternalServerErrorException(
            `主题配置文件格式错误, "${config?.name}" 字段中的 name 字段不存在`,
          );
        }
        if (!config?.type) {
          throw new InternalServerErrorException(
            `主题配置文件格式错误, "${
              (config as ThemeConfigItemAll)?.name
            }" 字段中的 type 字段不存在`,
          );
        }
        if (!Object.values(ThemeConfigType).includes(config.type)) {
          throw new InternalServerErrorException(
            `主题配置文件格式错误, "${config?.name}" 字段中的 type 字段不合法`,
          );
        }
        if (config.name.match(/[\u4e00-\u9fa5]/) && !config.key) {
          throw new InternalServerErrorException(
            `主题配置文件格式错误, "${config?.name}" 字段中的 key 字段不存在, 但是 name 字段是中文`,
          );
        }
        if (
          (config as ThemeConfigItemSelect).data &&
          (config as ThemeConfigItemSelect).data.length
        ) {
          (config as ThemeConfigItemSelect).data.forEach((data) => {
            if (data.name.match(/[\u4e00-\u9fa5]/) && !data.key) {
              throw new InternalServerErrorException(
                `主题配置文件格式错误, "${config?.name}" 字段中的 data 字段中的 "${data.name}" 字段中的 key 字段不存在, 但是 name 字段是中文`,
              );
            }
            if (!data.value) {
              throw new InternalServerErrorException(
                `主题配置文件格式错误, "${config?.name}" 字段中的 data 字段中的 "${data.name}" 字段中的 value 字段不存在`,
              );
            }
          });
        }
        if (!fs.existsSync(join(THEME_DIR, theme, 'package.json'))) {
          throw new InternalServerErrorException(`主题缺少 package.json 文件`);
        }
      });
    } catch (e) {
      if (error) {
        throw new InternalServerErrorException(`[${theme}] ${e.message}`);
      } else {
        consola.info(`${chalk.red(`[${theme}] ${e.message}`)}`);
        return false;
      }
    }
    this.dir.push(theme);
    this.dir = Array.from(new Set(this.dir)); // 去重
    return true;
  }

  /**
   * 获取主题配置
   * @param theme 主题名
   */
  async getThemeConfig(theme: string): Promise<ThemeDto> {
    const config = fs.readFileSync(
      join(THEME_DIR, theme, 'config.yaml'),
      'utf-8',
    );
    const _package = JSON.parse(
      fs.readFileSync(join(THEME_DIR, theme, 'package.json'), 'utf-8'),
    );
    const _yaml = yaml.load(config) as ThemeConfig;
    return {
      id: _yaml.id,
      name: _package.name,
      active:
        (await this.configService.get('themes'))?.find((t) => t.id === _yaml.id)
          ?.active || false,
      package: _package,
      version: _package.version,
      config: JSON.stringify(_yaml.configs),
    };
  }

  /**
   * 获取所有主题 (private)
   */
  private async _getAllThemes(): Promise<ThemeDto[]> {
    const themes: ThemeDto[] = [];
    const dirs = fs.readdirSync(THEME_DIR);
    for (const dir of dirs) {
      if (this.validateTheme(dir, false)) {
        themes.push(await this.getThemeConfig(dir));
      }
    }
    return themes;
  }

  /**
   * 获取所有主题
   */
  getAllThemes() {
    return this.themes;
  }

  /**
   * 启动主题
   */
  async activeTheme(id: string): Promise<boolean> {
    try {
      const themes = await this.configService.get('themes');
      const theme = themes.find((t) => t.id === id);
      const _theme = this.themes.find((t) => t.id === id);
      if (!_theme) {
        throw new InternalServerErrorException(`主题不存在`);
      }
      if (!theme) {
        await this.configService.patchAndValidate('themes', [
          ...themes,
          _theme,
        ]);
        return true;
      }
      theme.active = true;
      await this.configService.patchAndValidate('themes', [
        ...themes.filter((t) => t.id !== id),
        _theme, // 重新获取一次, 防止配置文件被修改而无更新
      ]);
      this.setENV(_theme.name);
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}