import { Injectable, InternalServerErrorException } from '@nestjs/common';
import AdmZip from 'adm-zip';
import { DATA_DIR } from '~/shared/constants/path.constant';
import { HttpService } from './helper.http.service';
import fs from 'fs';
import { isURL } from 'class-validator';

@Injectable()
export class AssetsService {
  constructor(private readonly http: HttpService) {}

  async downloadZIPAndExtract(url: string, _path: string) {
    if (!isURL(url)) {
      throw new InternalServerErrorException('Invalid URL');
    }
    const res = await this.http.axiosRef(url, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(res.data, 'binary');
    await this.extractZIP(buffer, _path);
    return true;
  }

  async extractZIP(buffer: Buffer, _path: string) {
    const zip = new AdmZip(buffer);
    zip.extractAllTo(path.join(DATA_DIR, _path), true);
  }

  async downloadFile(url: string, _path: string) {
    if (!isURL(url)) {
      throw new InternalServerErrorException('Invalid URL');
    }
    const res = await this.http.axiosRef(url, {
      responseType: 'arraybuffer',
    });
    const buffer = Buffer.from(res.data, 'binary');
    await this.writeFile(buffer, _path);
    return true;
  }

  async writeFile(buffer: Buffer, _path: string) {
    fs.writeFileSync(path.join(DATA_DIR, _path), buffer);
  }

  async uploadZIPAndExtract(buffer: Buffer, _path: string) {
    await this.extractZIP(buffer, _path);
    return true;
  }
}
