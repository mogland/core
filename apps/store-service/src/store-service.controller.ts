import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StoreEvents } from '~/shared/constants/event.constant';
import { StoreServiceService } from './store-service.service';

@Controller()
export class StoreServiceController {
  constructor(private readonly storeServiceService: StoreServiceService) {}

  @MessagePattern({ cmd: StoreEvents.Ping })
  ping() {
    return true;
  }

  @MessagePattern({ cmd: StoreEvents.StoreFileUploadByMaster })
  async storeFileUpload(data: {
    file: {
      filename: string;
      file: Buffer;
    };
    path?: string;
  }) {
    data.file.file = Buffer.from(data.file.file);
    return await this.storeServiceService.storeFile(data.file, data.path);
  }

  @MessagePattern({ cmd: StoreEvents.StoreFileDownloadFromRemote })
  async storeFileDownloadFromRemote(data: { url: string; path?: string }) {
    return await this.storeServiceService.downloadFile(data.url, data.path);
  }

  @MessagePattern({ cmd: StoreEvents.StoreFileDeleteByMaster })
  async storeFileDelete(path: string) {
    return await this.storeServiceService.deleteFile(path);
  }

  @MessagePattern({ cmd: StoreEvents.StoreFileGet })
  async storeFileGet(path: string) {
    return await this.storeServiceService.getFile(path);
  }

  @MessagePattern({ cmd: StoreEvents.StoreFileGetList })
  async storeFileList(path?: string) {
    return await this.storeServiceService.getFileList(path);
  }

  @MessagePattern({ cmd: StoreEvents.StoreFileMkdirByMaster })
  async storeFileMkdir(path: string) {
    return await this.storeServiceService.mkdir(path);
  }
}
