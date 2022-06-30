import { Controller, Get } from '@nestjs/common';
import { PluginsService } from './plugins.service';

@Controller('plugins')
export class PluginsController {
  constructor(
    private readonly pluginsService: PluginsService,
  ) {}

  @Get('/')
  async getPluginsLists() {
    return this.pluginsService.getPluginsLists();
  }

  @Get('/available')
  async availablePlugins() {
    return await this.pluginsService.availablePlugins();
  }



}
