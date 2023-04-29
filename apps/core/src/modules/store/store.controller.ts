import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { StoreEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

@Controller('store')
@ApiName
export class StoreController {
  constructor(
    @Inject(ServicesEnum.store) private readonly store: ClientProxy,
  ) {}

  @Get('/ping')
  @ApiOperation({ summary: '检测服务是否在线' })
  ping() {
    return transportReqToMicroservice(this.store, StoreEvents.Ping, {});
  }

  @Get('/list')
  @ApiOperation({ summary: '获取文件列表' })
  list() {
    return transportReqToMicroservice(
      this.store,
      StoreEvents.StoreFileGetList,
      {},
    );
  }

  @Get('/raw/*')
  @ApiOperation({ summary: '获取文件' })
  raw() {
    return transportReqToMicroservice(this.store, StoreEvents.StoreFileGet, {});
  }

  @Post('/download')
  @ApiOperation({ summary: '从远端下载文件' })
  @Auth()
  download(@Body('url') url: string, @Body('path') path?: string) {
    return transportReqToMicroservice(
      this.store,
      StoreEvents.StoreFileDownloadFromRemote,
      { url, path },
    );
  }

  @Post('/upload')
  @ApiOperation({ summary: '上传文件' })
  // @Auth()
  upload(
    @Body() body: BinaryData,
    @Body('name') name: string,
    @Body('path') path?: string,
  ) {
    return transportReqToMicroservice(
      this.store,
      StoreEvents.StoreFileUploadByMaster,
      {
        file: {
          filename: name,
          // file,
        },
        path,
      },
    );
  }

  @Post('/delete')
  @ApiOperation({ summary: '删除文件' })
  @Auth()
  delete(@Body('path') path: string) {
    return transportReqToMicroservice(
      this.store,
      StoreEvents.StoreFileDeleteByMaster,
      { path },
    );
  }

  @Post('/mkdir')
  @ApiOperation({ summary: '创建文件夹' })
  @Auth()
  mkdir(@Body('path') path: string) {
    return transportReqToMicroservice(
      this.store,
      StoreEvents.StoreFileMkdirByMaster,
      { path },
    );
  }
}
