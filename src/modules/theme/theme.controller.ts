import { Controller, Get, Query } from '@nestjs/common';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { ThemeService } from './theme.service';

@Controller('theme')
@ApiName
export class ThemeController {
  constructor(
    private readonly themeService: ThemeService,
  ) {}

  @Get('/admin/available')
  async availableThemes() {
    return this.themeService.availableThemes();
  }

  @Get('/admin/up')
  async turnOnTheme(@Query('name') name: string) {
    return this.themeService.turnOnTheme(name);
  }

  @Get('/admin/current')
  async currentTheme() {
    return this.themeService.currentTheme();
  }

  @Get('/admin/off')
  async turnOffTheme(@Query('name') name: string) {
    return this.themeService.turnOffTheme(name);
  }
}
