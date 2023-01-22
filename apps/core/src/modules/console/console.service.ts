import { Injectable } from '@nestjs/common';
import { HttpService } from '~/libs/helper/src/helper.http.service';
import { NPMFiles } from '~/shared/types/npm';
import { getPackageIntoInterface } from './console.interface';

@Injectable()
export class ConsoleService {
  constructor(private readonly http: HttpService) {}

  /**
   * 从 GitHub Release 获取最新版本信息
   */
  async getLatestVersionInfoFromGitHub(): Promise<getPackageIntoInterface> {
    const env = process.env.MOG_PRIVATE_ENV as unknown as object as {
      [key: string]: any;
    };
    const type = env.console?.versionType;
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
    const version = JSON.parse(
      await this.http.axiosRef.get(
        'https://registry.npmjs.org/@mogland/console',
      ),
    )['dist-tags'].latest;
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
}
