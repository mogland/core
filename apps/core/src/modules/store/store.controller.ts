import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { HTTPDecorators } from '~/shared/common/decorator/http.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { StoreEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { BadRequestRpcExcption } from '~/shared/exceptions/bad-request-rpc-exception';
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

  @Get(['/list/*', '/list'])
  @Auth()
  @ApiOperation({ summary: '获取文件列表' })
  list(@Param('*') path?: string) {
    return transportReqToMicroservice(
      this.store,
      StoreEvents.StoreFileGetList,
      path || '',
    );
  }

  @Get('/raw/*')
  @ApiOperation({ summary: '获取文件' })
  async raw(@Param('*') path: string, @Res() res: FastifyReply) {
    const data = await transportReqToMicroservice<{
      file: Buffer;
      name: string;
      ext: string;
      mimetype: string;
    }>(this.store, StoreEvents.StoreFileGet, path);
    if (data.mimetype) {
      res.type(data.mimetype);
      res.header('cache-control', 'public, max-age=31536000');
      res.header(
        'expires',
        new Date(Date.now() + 31536000 * 1000).toUTCString(),
      );
    }
    const buffer = Buffer.from(data.file);
    res.send(buffer);
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
  @Auth()
  @HTTPDecorators.FileUpload({ description: 'upload file' })
  async upload(@Req() req: FastifyRequest) {
    const data = await req.file();

    const _path = (req.query as any).path as string;
    if (!data) {
      throw new BadRequestRpcExcption('仅能上传文件！');
    }
    if (data.fieldname != 'file') {
      throw new BadRequestRpcExcption('字段必须为 file');
    }

    const filename = data.filename;
    return transportReqToMicroservice(
      this.store,
      StoreEvents.StoreFileUploadByMaster,
      {
        file: {
          filename,
          file: await data.toBuffer(),
        },
        path: _path,
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
      path,
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

  @Patch(['/rename', '/move'])
  @ApiOperation({ summary: '重命名/移动文件' })
  @Auth()
  rename(@Body('oldPath') oldPath: string, @Body('newPath') newPath: string) {
    return transportReqToMicroservice(
      this.store,
      StoreEvents.StoreFileMoveByMaster,
      { oldPath, newPath },
    );
  }
}
