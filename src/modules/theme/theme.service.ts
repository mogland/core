import { BadRequestException, Get, Injectable, Logger, Render } from '@nestjs/common';
import { YAML } from 'zx-cjs';
import { THEME_DIR } from '~/constants/path.constant';
import { ThemeDto } from '../configs/configs.dto';
import { ConfigsService } from '../configs/configs.service';

@Injectable()
export class ThemeService {
  private logger: Logger;
  private CORE_VERSION = require('../../../package.json').version
  constructor(
    private readonly configsService: ConfigsService,
    
  ) {
    this.logger = new Logger(ThemeService.name)
  }

  private async turnOnThemeLibs(name: string) {
    // 查找配置文件是否存在
    const themeConfigFile = await fs
      .readFile(`${THEME_DIR}/${name}/theme.yaml`, "utf8")
      .catch(() => {
        throw new BadRequestException(`主题 ${name} 配置文件不存在`);
      })

    const themeConfig = YAML.parse(themeConfigFile); // 解析配置文件

    if (themeConfig.name !== name) { // 严格按照主题名称来配置，考虑大小写
      throw new BadRequestException(`主题 ${name} 配置文件名称不匹配`);
    }

    // 检查主题是否适合当前后端的版本
    if (
      this.CORE_VERSION > themeConfig.support_min_version &&
      this.CORE_VERSION < themeConfig.support_max_version
    ) {
      // 提醒建议使用的版本
      this.CORE_VERSION !== themeConfig.recommend_version && this.logger.warn(`主题 ${name} 建议使用版本 ${themeConfig.recommend_version}`)
    } else if ( themeConfig.support_max_version == 'latest' ) {} else {
      throw new BadRequestException(`主题 ${name} 不支持当前版本`);
    }

    return {
      themeConfig,
    }
  }

  /**
   * 可用的主题列表
   */
  async availableThemes() {
    const themes = await fs.readdir(THEME_DIR); // 获取主题目录下的所有主题
    return themes.filter(theme => fs.existsSync(path.join(THEME_DIR, theme, 'theme.yaml')));
  }

  /**
   * turnOnTheme 启动主题
   */
  async turnOnTheme(name: string) {
    if (fs.existsSync(path.join(THEME_DIR, name))) { // 检查主题是否存在

      const { themeConfig } = await this.turnOnThemeLibs(name); // 获取主题配置
      const theme: ThemeDto = { // 创建主题对象
        name,
        enable: true,
        configs: themeConfig.configs ? themeConfig.configs : {},
      }
      await this.configsService.patch('theme', theme); // 更新主题配置
      return `主题 ${name} 启动成功`;
    }
  }

  async turnOffTheme(name: string) {
    if (fs.existsSync(path.join(THEME_DIR, name))) { // 检查主题是否存在
      const theme: ThemeDto = { // 创建主题对象
        name,
        enable: false,
        configs: {},
      }
      await this.configsService.patch('theme', theme); // 更新主题配置
      return `主题 ${name} 关闭成功`;
    }
  }

  async currentTheme() {
    const theme = await this.configsService.get('theme');
    return theme;
  }

  // ********************************************************
  // 以下是主题渲染相关的方法

  @Get('/')
  
  async renderIndex() {}
}
