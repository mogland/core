import { Injectable } from '@nestjs/common';
import { HttpService } from '~/libs/helper/src/helper.http.service';
import { NPMFiles } from '~/shared/types/npm';
import { getPackageIntoInterface } from './console.interface';

@Injectable()
export class ConsoleService {
  private readonly env;
  constructor(private readonly http: HttpService) {
    this.env = process.env.MOG_PRIVATE_ENV as unknown as object as {
      [key: string]: any;
    };
  }

  /**
   * 从 GitHub Release 获取最新版本信息
   */
  async getLatestVersionInfoFromGitHub(): Promise<getPackageIntoInterface> {
    const type = this.env.console?.versionType;
    const url = `https://api.github.com/repos/mogland/console/releases/${
      type !== 'pre-relese' ? '' : 'latest'
    }`;
    const res = JSON.parse(await this.http.axiosRef.get(url));
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
      await this.http.axiosRef.get(
        'https://registry.npmjs.org/@mogland/console',
      ),
    )['dist-tags'];
    const version =
      this.env.console?.versionType === 'pre-relese'
        ? versionInfo['next']
        : versionInfo['latest'];
    const files: NPMFiles = JSON.parse(
      await this.http.axiosRef.get(
        `https://www.npmjs.com/package/@mogland/console/v/${version}/index`,
      ),
    );
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
