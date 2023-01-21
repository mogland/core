import { Injectable } from '@nestjs/common';
import { HttpService } from '~/libs/helper/src/helper.http.service';

@Injectable()
export class ConsoleService {
  constructor(private readonly http: HttpService) {}

  /**
   * 从 GitHub Release 获取最新版本信息
   * @returns 版本号
   */
  async getLatestVersionInfoFromGitHub() {
    const env = process.env.MOG_PRIVATE_ENV as unknown as object as {
      [key: string]: any;
    };
    const type = env.console?.versionType;
    const url = `https://api.github.com/repos/mogland/console/releases/${
      type !== 'pre-relese' ? '' : 'latest'
    }`;
    const res = JSON.parse(await this.http.axiosRef.get(url));
    if (type !== 'pre-relese') {
      return {
        version: res.tag_name,
        packages: res.assets.map((asset: any) => {
          const url = asset.browser_download_url;
          const name = url.split('/').pop();
          return {
            name,
            url: `https://ghproxy.com/${url}`,
          };
        }),
      };
    } else {
      return {
        version: res[0].tag_name,
      };
    }
  }
}
