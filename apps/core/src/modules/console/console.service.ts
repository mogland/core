import { JSDOM } from 'jsdom';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '~/libs/helper/src/helper.http.service';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { consola } from '~/shared/global/consola.global';
import { NPMFiles } from '~/shared/types/npm';
import {
  getPackageIntoFiles,
  getPackageIntoInterface,
} from './console.interface';
import { CONSOLE_NPM_VERSION_API } from '~/shared/constants/others.constant';

@Injectable()
export class ConsoleService {
  private logger: Logger;
  private readonly env: {
    [key: string]: any;
  };
  private files: getPackageIntoFiles[] = [];
  constructor(private readonly http: HttpService) {
    this.logger = new Logger(ConsoleService.name);
    this.env = JSON.parse(process.env.MOG_PRIVATE_ENV || '{}')?.console as {
      [key: string]: any;
    };
    try {
      if (this.env?.enable) {
        if (this.env?.source !== 'npm') {
          const type = this.env?.versionType;
          const url = `https://api.github.com/repos/mogland/console/releases${
            type === 'pre-release' ? '' : '/latest'
          }`;
          this.http.cleanCache(url);
          this.getLatestVersionInfoFromGitHub().then((res) => {
            this.files = res.packages;
            consola.success(
              `[ConsoleService] ${ExceptionMessage.ConsoleInitSuccess}`,
            );
          });
        } else {
          this.http.cleanCache(CONSOLE_NPM_VERSION_API);
          this.getLatestVersionInfoFromNpm().then((res) => {
            this.files = res.packages;
            if (res.version === 'NaN') {
              throw new Error(ExceptionMessage.CONSOLE_INIT_FAILED);
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
   * 刷新控制台版本缓存
   */
  async refreshConsoleVersionCache() {
    try {
      if (this.env?.enable) {
        if (this.env?.source !== 'npm') {
          this.getLatestVersionInfoFromGitHub().then((res) => {
            this.files = res.packages;
            consola.success(
              `[ConsoleService] ${ExceptionMessage.ConsoleRefreshSuccess}`,
            );
          });
        } else {
          await this.http.cleanCache(CONSOLE_NPM_VERSION_API);
          this.getLatestVersionInfoFromNpm().then((res) => {
            this.files = res.packages;
            if (res.version === 'NaN') {
              throw new Error(ExceptionMessage.ConsoleRefreshFailed);
            }
            consola.success(
              `[ConsoleService] ${ExceptionMessage.ConsoleRefreshSuccess}`,
            );
          });
        }
      } else {
        consola.info(`[ConsoleService] ${ExceptionMessage.ConsoleIsDisabled}`);
      }
    } catch {
      this.logger.error(ExceptionMessage.ConsoleRefreshFailed);
    }
  }

  /**
   * 从 GitHub Release 获取最新版本信息
   */
  async getLatestVersionInfoFromGitHub(): Promise<getPackageIntoInterface> {
    const type = this.env?.versionType;
    const url = `https://api.github.com/repos/mogland/console/releases${
      type === 'pre-release' ? '' : '/latest'
    }`;
    const res = await this.http
      .getAndCacheRequest(url)
      .then((res) => JSON.parse(res))
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
    const json = type !== 'pre-release' ? res : res[0];
    const proxy = this.env?.proxy?.gh || 'https://ghproxy.com';
    consola.info(`[ConsoleService] Mog Console Version: ${json.tag_name}`);
    return {
      version: json.tag_name,
      packages: json.assets.map((asset: any) => {
        const url = asset.browser_download_url;
        const name = url.split('/').pop();
        return {
          name,
          url: `${proxy}/${url}`,
          type: name.split('.')?.pop() || 'unknown',
        };
      }),
    };
  }

  /**
   * 从 NPM 获取最新版本的信息
   */
  async getLatestVersionInfoFromNpm(): Promise<getPackageIntoInterface> {
    const versionInfo = await this.http.axiosRef
      .get(CONSOLE_NPM_VERSION_API)
      .then((res) => res.data?.['dist-tags'])
      .catch(() => {
        this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
        return {};
      });
    let version =
      this.env?.versionType === 'pre-release'
        ? versionInfo?.['next']
        : versionInfo?.['latest'];
    if (!version && this.env?.versionType === 'pre-release') {
      version = versionInfo?.['latest']; // 如果没有 next 版本，则使用 latest 版本
    }
    consola.info(`[ConsoleService] Mog Console Version: ${version}`);
    let files: NPMFiles;
    try {
      files = await this.http
        .getAndCacheRequest(
          `https://www.npmjs.com/package/@mogland/console/v/${version}/index`,
        )
        .then((res) => JSON.parse(res))
        .catch((err) => {
          console.log(err);
          this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
          return {};
        });
    } catch {
      // 此处的 JSON.parse 可能会抛出异常（如直接访问一个不存在的版本），因此需要 try catch
      this.logger.error(ExceptionMessage.CONSOLE_INIT_FAILED);
      this.logger.error(
        '无法获取到 NPM 的文件列表，因此 Mog 无法初始化 Console。',
      );
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
  async transformPathToFile(
    path?: string,
    requestURL?: string,
  ): Promise<{
    data: string;
    type: string;
  }> {
    if (!path) {
      path = 'index.html';
    }
    const index = this.files.find((file) => file.name === 'index.html');
    const file = this.files.find((file) => file.name === path);
    return {
      data: await (file?.type === 'html' ||
      file?.type === 'js' ||
      file?.type === 'css'
        ? this.http.getAndCacheRequest(file?.url || index!.url)
        : this.http.axiosRef.get(file?.url || index!.url)
      )
        .then((res) => {
          const data =
            file?.type === 'html' || file?.type === 'js' || file?.type === 'css'
              ? res
              : res.data;
          if (file?.type ? file.type === 'html' : true) {
            const dom = new JSDOM(data);
            const document = dom.window.document;
            document.head.innerHTML += `
              <!-- Injected by Mog Core, DO NOT REMOVE -->
              <script>window.MOG_BASE = "/console";window.MOG_API = "http://${requestURL}";</script>
            `;
            return dom.serialize();
          }
          return data;
        })
        .catch(() => {
          this.logger.error(ExceptionMessage.CONSOLE_REQUEST_FAILED);
        }),
      type: file?.type || 'html',
    };
  }
}
