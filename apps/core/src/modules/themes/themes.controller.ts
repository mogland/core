import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { ThemesEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

@Controller('themes')
@ApiName
export class ThemesController {
  constructor(
    @Inject(ServicesEnum.theme) private readonly themes: ClientProxy,
  ) {}

  @Get('/ping')
  async ping() {
    return transportReqToMicroservice(this.themes, ThemesEvents.Ping, {});
  }

  @Get('/')
  async getAll() {
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemesGetAll,
      {},
    );
  }

  @Get('/:id')
  async getInfo(@Param('id') id: string) {
    return transportReqToMicroservice(this.themes, ThemesEvents.ThemeGetInfo, {
      id,
    });
  }

  @Patch('/:id')
  async active(@Param('id') id: string) {
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemeActiveByMaster,
      { id },
    );
  }

  @Delete('/:id')
  async delete(
    @Param('id') id: string,
    @Query('removeConfig') removeConfig: boolean,
  ) {
    // @ts-ignore The type of removeConfig maybe string
    removeConfig = removeConfig === 'true' ? true : false;
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemeDeleteByMaster,
      { id, removeConfig },
    );
  }

  @Get('/:id/config')
  async getConfig(@Param('id') id: string) {
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemeGetConfig,
      { id },
    );
  }

  @Get('/:id/config/:key')
  async getConfigItem(@Param('id') id: string, @Param('key') key: string) {
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemeGetConfigItem,
      { id, key },
    );
  }

  @Patch('/:id/config/:key/:value')
  async setConfigItem(
    @Param('id') id: string,
    @Param('key') key: string,
    @Param('value') value: string,
  ) {
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemeUpdateConfigItem,
      { id, key, value },
    );
  }

  @Patch('/:id/config')
  async setConfig(@Param('id') id: string, @Body('config') config: any) {
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemeUpdateConfig,
      { id, config },
    );
  }

  @Get('/manager/download')
  @Auth()
  async download(@Query('url') url: string) {
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemeDownloadByMaster,
      { url },
    );
  }

  @Post('/manager/upload')
  @Auth()
  async upload(@Body('file') file: Buffer) {
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemeUploadByMaster,
      { file },
    );
  }

  @Get('/manager/update')
  @Auth()
  async update(@Query('id') id: string) {
    return transportReqToMicroservice(
      this.themes,
      ThemesEvents.ThemeUpdateByMaster,
      { id },
    );
  }
}
