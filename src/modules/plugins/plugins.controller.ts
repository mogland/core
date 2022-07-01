import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { PluginsService } from './plugins.service';

@Controller('plugins')
@ApiName
export class PluginsController {
  constructor(
    private readonly pluginsService: PluginsService,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '获取插件列表' })
  async getPluginsLists() {
    return this.pluginsService.getPluginsLists();
  }

  @Get('/active')
  @ApiOperation({ summary: '激活插件' })
  @ApiQuery({ name: 'name', description: '插件名称' })
  async activePlugin(@Query() query: any) {
    return await this.pluginsService.activePlugin(query.name);
  }

  @Get('/available')
  @ApiOperation({ summary: '获取全部激活插件' })
  async availablePlugins() {
    return await this.pluginsService.availablePlugins();
  }



}
