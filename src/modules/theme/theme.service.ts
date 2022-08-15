import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { quiet, YAML } from 'zx-cjs';
import mkdirp from 'mkdirp';
import { THEME_DIR } from '~/constants/path.constant';
import { HttpService } from '~/processors/helper/helper.http.service';
import { ThemeDto } from '../configs/configs.dto';
import { ConfigsService } from '../configs/configs.service';
import { writeFile } from 'fs/promises';
import { cp } from 'fs';

@Injectable()
export class ThemeService {
  private logger: Logger;
  private CORE_VERSION = require('../../../package.json').version
  constructor(
    private readonly configsService: ConfigsService,
    private readonly http: HttpService,

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
    } else if (themeConfig.support_max_version == 'latest') { } else {
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

  async downloadRepoArchive(repo: string, type: "GitHub" | "Custom") {
    const url = type === "GitHub" ? `https://api.github.com/repos/${repo}/zipball` : repo;
    const { data } = await this.http.axiosRef.get(url);
    return await this.uploadThemeFile(data, repo.split('/')[1]);
  }

  async uploadThemeFile(buffer: Buffer, name: string) {
    if (!buffer.slice(0, 2).toString("hex").includes("1f8b")) {
      throw new BadRequestException("不是tar.gz文件");
    }
    // 检查大小
    if (!buffer.length) {
      throw new BadRequestException("文件为空");
    }
    this.logger.warn("正在上传主题文件...");
    const themePath = join(THEME_DIR, name)
    mkdirp.sync(themePath)
    const tmpPath = join(THEME_DIR, "tmp", `${name}_tmp.tar.gz`)
    try {
      await writeFile(tmpPath, buffer) // 写入临时文件
      cd(tmpPath)
      await nothrow(quiet($`tar -xzf ${name}_tmp.tar.gz`)) // 解压
      const files = await nothrow(quiet($`ls | grep -v ${name}_tmp.tar.gz`)) // 获取文件列表, 去除临时文件, 获取主题文件目录名
      cd(join(THEME_DIR, "tmp", files[0])) // 进入主题目录
      await nothrow(quiet($`mv * ${themePath}`)) // 将主题文件移动到主题目录
      await nothrow(quiet($`rm -rf ${tmpPath}`)) // 删除临时文件
      this.logger.warn("主题 ${name} 上传成功");
      return `主题 ${name} 上传成功`;
      
    } catch (e) {
      this.logger.error(
        `上传主题文件失败，请检查主题文件是否正确` || e.stderr
      )
    }
  }

}
