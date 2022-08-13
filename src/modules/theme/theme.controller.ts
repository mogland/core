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

  // ********************************************************
  // 以下是针对静态资源访问的接口
  @Get('/public/*')
  async public(@Res() res, @Param() param: string) {
    const filePath = join(THEME_DIR, (await this.themeService.currentTheme())!.name, "public", param['*']);
    const file = await fs.readFile(filePath);
    if (!file) {
      return res.status(404).send();
    } else {
      res.type(mime.getType(filePath));
      res.send(file);
    }
  }

}
