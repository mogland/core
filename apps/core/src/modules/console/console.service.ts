import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '~/libs/helper/src/helper.http.service';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { consola } from '~/shared/global/consola.global';
import { NPMFiles } from '~/shared/types/npm';
import {
  getPackageIntoFiles,
  getPackageIntoInterface,
} from './console.interface';

@Injectable()
export class ConsoleService {
  private logger: Logger;
  private readonly env: {
    [key: string]: any;
  };
  private files: getPackageIntoFiles[] = [];
  constructor(private readonly http: HttpService) {
    this.logger = new Logger(ConsoleService.name);
    this.env = JSON.parse(process.env.MOG_PRIVATE_ENV!).console as {
      [key: string]: any;
    };
    try {
      if (this.env?.enable) {
        if (this.env?.source === 'gh') {
          this.getLatestVersionInfoFromGitHub().then((res) => {
            this.files = res.packages;
            consola.success(
              `[ConsoleService] ${ExceptionMessage.ConsoleInitSuccess}`,
            );
          });
        } else {
          this.getLatestVersionInfoFromNpm().then((res) => {
            this.files = res.packages;
            if (res.version === 'NaN') {
              return;
            }
            consola.success(
              `[ConsoleService] ${ExceptionMessage.ConsoleInitSuccess}`,
            );
          });
        }
      } else {
        consola.info(`[ConsoleService] ${ExceptionMessage.ConsoleIsDisabled}`);
      }
    } catch {
      this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
    }
  }

  /**
   * 从 GitHub Release 获取最新版本信息
   */
  async getLatestVersionInfoFromGitHub(): Promise<getPackageIntoInterface> {
    const type = this.env?.versionType;
    const url = `https://api.github.com/repos/mogland/console/releases${
      type === 'pre-relese' ? '' : '/latest'
    }`;
    const res = await this.http.axiosRef
      .get(url)
      .then((res) => res.data)
      .catch(() => {
        this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
        return {};
      });
    if (!Object.keys(res).length) {
      return {
        version: 'NaN',
        packages: [],
      };
    }
    const json = type !== 'pre-relese' ? res : res[0];
    return {
      version: json.tag_name,
      packages: json.assets.map((asset: any) => {
        const url = asset.browser_download_url;
        const name = url.split('/').pop();
        return {
          name,
          url: `https://ghproxy.com/${url}`,
          type: name.split('.')?.pop() || 'unknown',
        };
      }),
    };
  }

  /**
   * 从 NPM 获取最新版本的信息
   */
  async getLatestVersionInfoFromNpm(): Promise<getPackageIntoInterface> {
    const versionInfo = JSON.parse(
      await this.http.axiosRef
        .get('https://registry.npmjs.org/@mogland/console')
        .then((res) => res.data)
        .catch(() => {
          this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
          return '{}';
        }),
    )['dist-tags'];
    const version =
      this.env?.versionType === 'pre-relese'
        ? versionInfo?.['next']
        : versionInfo?.['latest'];
    let files: NPMFiles;
    try {
      files = JSON.parse(
        await this.http.axiosRef
          .get(
            `https://www.npmjs.com/package/@mogland/console/v/${version}/index`,
          )
          .then((res) => res.data)
          .catch(() => {
            this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
            return '{}';
          }),
      );
    } catch {
      // 此处的 JSON.parse 可能会抛出异常（如直接访问一个不存在的版本），因此需要 try catch
      // 安全起见，如果获取失败，直接返回空数组
      this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
      return {
        version: 'NaN',
        packages: [],
      };
    }
    const returns: getPackageIntoInterface = {
      version,
      packages: [],
    };
    Object.entries(files.files).forEach(([key, value]) => {
      const name = key.split('/').pop();
      returns.packages.push({
        name: name!,
        url: `https://www.npmjs.com/package/@mogland/console/file/${value.hex}`,
        type: name!.split('.')?.pop() || 'unknown',
      });
    });
    return returns;
  }

  /**
   * 把路径转换为文件
   * @param path 路径
   */
  async transformPathToFile(path: string): Promise<string> {
    const file = this.files.find((file) => file.name === path);
    if (file) {
      return await this.http.axiosRef
        .get(file.url)
        .then((res) => res.data)
        .catch(() => {
          this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
        });
    } else {
      this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
      throw new InternalServerErrorException(
        ExceptionMessage.CONSOLE_INIT_FAILED,
      );
    }
  }
}
