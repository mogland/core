import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { AssetsService } from '~/libs/helper/src/helper.assets.service';
import { STORE_DIR } from '~/shared/constants/path.constant';
import { InternalServerErrorException } from '~/shared/exceptions/internal-server-error';

@Injectable()
export class StoreServiceService {
  constructor(private readonly assetHelper: AssetsService) {}

  async storeFile(data: {
    filename: string;
    file: Buffer;
  }, path?: string) {
    const _path = join(STORE_DIR, path || '');
    const buffer = data.file;
    const name = data.filename;
    return name;
    await this.assetHelper.writeFile(buffer, _path, name).catch((e) => {
      throw new InternalServerErrorException(e);
    });
    return true;
  }

  async downloadFile(url: string, path?: string) {
    const _path = join(STORE_DIR, path || '');
    await this.assetHelper.downloadFile(url, _path).catch((e) => {
      throw new InternalServerErrorException(e);
    });
    return true;
  }

  async deleteFile(path: string) {
    await this.assetHelper.deleteFile(path).catch((e) => {
      throw new InternalServerErrorException(e);
    });
    return true;
  }

  async getFile(path: string) {
    const _path = join(STORE_DIR, path || '');
    return await this.assetHelper.getFile(_path).catch((e) => {
      throw new InternalServerErrorException(e);
    });
  }

  async getFileList(path?: string) {
    const _path = join(STORE_DIR, path || '');
    return await this.assetHelper.getFileList(_path).catch((e) => {
      throw new InternalServerErrorException(e);
    });
  }

  async mkdir(path: string) {
    const _path = join(STORE_DIR, path || '');
    return await this.assetHelper.mkdir(_path).catch((e) => {
      throw new InternalServerErrorException(e);
    });
  }
}
