import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { AssetsService } from '~/libs/helper/src/helper.assets.service';
import { STORE_DIR } from '~/shared/constants/path.constant';
import { InternalServerErrorRpcExcption } from '~/shared/exceptions/internal-server-error-rpc-exception';

@Injectable()
export class StoreServiceService {
  constructor(private readonly assetHelper: AssetsService) {}

  async storeFile(
    data: {
      filename: string;
      file: Buffer;
    },
    path?: string,
  ) {
    const _path = join(STORE_DIR, path || '');
    const name = data.filename;
    if (this.assetHelper.exists(join(_path, name))) {
      throw new InternalServerErrorRpcExcption('文件夹已存在');
    }
    return await this.assetHelper
      .writeFile(data.file, _path, name)
      .catch((e) => {
        console.log(e);
        throw new InternalServerErrorRpcExcption(e);
      });
  }

  async downloadFile(url: string, path?: string) {
    const _path = join(STORE_DIR, path || '');
    await this.assetHelper.downloadFile(url, _path).catch((e) => {
      throw new InternalServerErrorRpcExcption(e);
    });
    return true;
  }

  async deleteFile(path: string) {
    path = decodeURIComponent(path);
    await this.assetHelper.deleteFile(path).catch((e) => {
      throw new InternalServerErrorRpcExcption(e.message);
    });
    return true;
  }

  async getFile(path: string) {
    const _path = join(STORE_DIR, path || '');
    return await this.assetHelper.getFile(_path).catch((e) => {
      throw new InternalServerErrorRpcExcption(e);
    });
  }

  async getFileList(path?: string) {
    const _path = join(STORE_DIR, path || '');
    return await this.assetHelper.getFileList(_path).catch((e) => {
      throw new InternalServerErrorRpcExcption(e);
    });
  }

  async mkdir(path: string) {
    const _path = join(STORE_DIR, path || '');
    return await this.assetHelper.mkdir(_path).catch((e) => {
      throw new InternalServerErrorRpcExcption(e);
    });
  }
}
