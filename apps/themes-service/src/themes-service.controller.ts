import {
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import ejs from 'ejs';
import { FastifyReply, FastifyRequest } from 'fastify';
import mime from 'mime';
import { AssetsService } from '~/libs/helper/src/helper.assets.service';
import { ThemesEvents } from '~/shared/constants/event.constant';
import { THEME_DIR } from '~/shared/constants/path.constant';
import { consola } from '~/shared/global/consola.global';
import { ThemeEnum, ThemesRenderService } from './themes-render.service';
import { ThemesServiceService } from './themes-service.service';

@Controller()
export class ThemesServiceController {
  constructor(
    private readonly themesServiceService: ThemesServiceService,
    private readonly render: ThemesRenderService,
    private readonly assetsService: AssetsService,
  ) {}

  // ===Microservice=== : 用于主题服务与网关层等通信，将所有操作主题的方法都由网关层调用活动执行
  @MessagePattern({ cmd: ThemesEvents.ThemesGetAll })
  getAllThemes() {
    return this.themesServiceService.getAllThemes();
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeGetInfo })
  async getThemeInfo(data: { id: string }) {
    return await this.themesServiceService.getTheme(data.id);
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeActiveByMaster })
  async activeTheme(data: { id: string }) {
    return await this.themesServiceService.activeTheme(data.id);
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeDeleteByMaster })
  async deleteTheme(data: { id: string; removeConfig: boolean }) {
    return await this.themesServiceService.deleteTheme(
      data.id,
      data.removeConfig,
    );
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeGetConfig })
  async getThemeConfig(data: { id: string }) {
    return await this.themesServiceService.getThemeConfig(data.id);
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeGetConfigItem })
  async getThemeConfigItem(data: { id: string; key: string }) {
    return await this.themesServiceService.getThemeConfigItem(
      data.id,
      data.key,
    );
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeUpdateConfig })
  async updateThemeConfig(data: { id: string; config: string }) {
    return await this.themesServiceService.updateThemeConfig(
      data.id,
      data.config,
    );
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeUpdateConfigItem })
  async updateThemeConfigItem(data: {
    id: string;
    key: string;
    value: string;
  }) {
    return await this.themesServiceService.updateThemeConfigItem(
      data.id,
      data.key,
      data.value,
    );
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeDownloadByMaster })
  async downloadTheme(data: { url: string }) {
    await this.themesServiceService.downloadTheme(data.url);
    return true;
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeUploadByMaster })
  async uploadTheme(data: { file: Buffer }) {
    await this.assetsService.uploadZIPAndExtract(
      data.file,
      path.join(THEME_DIR),
    );
    await this.themesServiceService.refreshThemes();
    return true;
  }

  @MessagePattern({ cmd: ThemesEvents.ThemeUpdateByMaster })
  async updateTheme(data: { id: string }) {
    await this.themesServiceService.updateTheme(data.id);
  }

  private async _render(
    reply: FastifyReply,
    req: FastifyRequest,
    query: { [key: string]: string },
    params: { [key: string]: string },
    layout: ThemeEnum,
  ) {
    try {
      const theme =
        JSON.parse(process.env.MOG_PRIVATE_INNER_ENV || '{}')?.theme ||
        undefined;
      if (!theme) {
        consola.info('Theme not found.');
        reply.code(500);
        reply.send('Theme not found.');
        return;
      }
      let variables = await this.render
        .getAllVariables(layout, query, params, req)
        .catch((err) => {
          reply.code(500);
          reply.send({
            statusCode: 500,
            message: `获取变量时出错: ${err}`,
          });
          throw new InternalServerErrorException(err);
        });
      let themePath: string;
      let themeFile: string;
      if (layout === ThemeEnum.custom) {
        const page = variables.site.pages.find(
          (page) => page.slug === variables.path.replace(/^\//, ''),
        );
        if (page) {
          layout = ThemeEnum.page;
          themePath = path.join(THEME_DIR, theme, `${layout}.ejs`);
          themeFile = fs.readFileSync(themePath, 'utf-8');
          variables = await this.render // 重新获取变量
            .getAllVariables(ThemeEnum.page, query, params, req)
            .catch((err) => {
              reply.code(500);
              reply.send({
                statusCode: 500,
                message: `获取变量时出错: ${err}`,
              });
              throw new InternalServerErrorException(err);
            });
        } else {
          const customPath = path.join(
            THEME_DIR,
            theme,
            'custom',
            `page-${variables.path.replace(/^\//, '')}.ejs`,
          );
          await fs.exists(customPath).then(async (exists) => {
            if (exists) {
              themePath = customPath;
              themeFile = await fs.readFile(themePath, 'utf-8');
            }
          });
        }
      } else {
        themePath = path.join(THEME_DIR, theme, `${layout}.ejs`);
        themeFile = fs.readFileSync(themePath, 'utf-8');
      }
      const themeRender = ejs.compile(themeFile!, {
        root: path.join(THEME_DIR, theme),
      });
      const plugins = await this.render
        .injectHelpers(variables)
        .catch((err) => {
          reply.code(500);
          reply.send({
            statusCode: 500,
            message: `获取插件时出错: ${err}`,
          });
          throw new InternalServerErrorException(err);
        });
      for (const key in plugins) {
        // 注入插件
        variables[key] = plugins[key];
      }
      const html = themeRender(variables);
      reply.header('Content-Type', 'text/html; charset=utf-8');
      reply.send(html);
    } catch (err) {
      reply.code(500);
      reply.send({
        statusCode: 500,
        message: `渲染主题时出错: ${err}`,
      });
      consola.error(err);
    }
  }

  // ===Web===：输出主题
  @Get(['/', '/posts'])
  async home(
    @Res() reply: FastifyReply,
    @Req() req: FastifyRequest,
    @Query() query: { [key: string]: string },
    @Param() params: { [key: string]: string },
  ) {
    await this._render(reply, req, query, params, ThemeEnum.index);
  }

  @Get(['/archives', '/category/:slug', '/tag/:name'])
  async archives(
    @Res() reply: FastifyReply,
    @Req() req: FastifyRequest,
    @Query() query,
    @Param() params,
  ) {
    await this._render(reply, req, query, params, ThemeEnum.archives);
  }

  @Get('/posts/:category/:slug')
  async post(
    @Res() reply: FastifyReply,
    @Req() req: FastifyRequest,
    @Query() query,
    @Param() params,
  ) {
    await this._render(reply, req, query, params, ThemeEnum.post);
  }

  @Get('/friends')
  async friends(
    @Res() reply: FastifyReply,
    @Req() req: FastifyRequest,
    @Query() query,
    @Param() params,
  ) {
    await this._render(reply, req, query, params, ThemeEnum.friends);
  }

  @Get(['/raw/*'])
  async assets(@Req() req: FastifyRequest, @Res() reply: FastifyReply) {
    // @ts-ignore
    const file = req.params['*'];
    if (!file)
      throw new ForbiddenException(
        `Please don't access the root directory directly. Please use /raw/filename to access files.`,
      );
    const theme =
      JSON.parse(process.env.MOG_PRIVATE_INNER_ENV || '{}')?.theme || undefined;
    if (!theme) {
      consola.info('Theme not found.');
      reply.code(500);
      reply.send('Theme not found.');
      return;
    }
    const themePath = path.join(THEME_DIR, theme, file);
    const themeFile = await fs.readFile(themePath, 'utf-8').catch((err) => {
      reply.code(500);
      reply.send({
        statusCode: 500,
        message: `读取文件时出错: ${err}`,
      });
      return '';
    });
    const themeType = mime.getType(themePath) || 'text/plain';
    reply.header('Content-Type', `${themeType}; charset=utf-8`);
    reply.send(themeFile);
  }

  @Get(['/raw'])
  async assetsRoot() {
    throw new ForbiddenException(
      `Please don't access the root directory directly. Please use /raw/filename to access files.`,
    );
  }

  @Get(['/favicon.*', '/robot.txt'])
  async rawAssets() {}

  // @Get('/page')
  // async page(
  //   @Res() reply: FastifyReply,
  //   @Req() req: FastifyRequest,
  //   @Query() query,
  //   @Param() params,
  // ) {
  //   await this._render(reply, req, query, params, ThemeEnum.page);
  // }

  @Get(['/*'])
  async renderCustomPage(
    @Res() reply: FastifyReply,
    @Req() req: FastifyRequest,
    @Query() query,
    @Param() params,
  ) {
    await this._render(reply, req, query, params, ThemeEnum.custom);
  }
}
