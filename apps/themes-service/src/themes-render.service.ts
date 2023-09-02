import { Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import { CategoryType } from '~/apps/page-service/src/model/category.model';
import {
  CategoryEvents,
  CommentsEvents,
  ConfigEvents,
  FriendsEvents,
  PageEvents,
  PostEvents,
  UserEvents,
} from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PagerDto } from '~/shared/dto/pager.dto';
import { consola } from '~/shared/global/consola.global';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import { getValueFromQuery } from '~/shared/utils/query-param';
import { THEME_DIR } from '~/shared/constants/path.constant';
import { isDev } from '~/shared/utils';
import { YAML, path } from 'zx-cjs';

export enum ThemeEnum {
  page = 'page',
  post = 'post',
  category = 'category',
  tag = 'tag',
  archives = 'archives',
  index = 'index',
  friends = 'friends',
  custom = 'custom',
}

@Injectable()
export class ThemesRenderService {
  constructor(
    @Inject(ServicesEnum.page) private readonly pageService: ClientProxy,
    @Inject(ServicesEnum.user) private readonly userService: ClientProxy,
    @Inject(ServicesEnum.friends) private readonly friendsService: ClientProxy,
    @Inject(ServicesEnum.comments)
    private readonly commentsService: ClientProxy,
    @Inject(ServicesEnum.config)
    private readonly configService: ClientProxy,
  ) {}
  /**
   * 网站变量，包含全部文章、页面、分类、标签
   */
  async getSiteVariables() {
    const pages = await transportReqToMicroservice(
      this.pageService,
      PageEvents.PagesGetAll,
      {},
    );
    const posts = await transportReqToMicroservice(
      this.pageService,
      PostEvents.PostsListGetAll,
      {},
    );
    const categories = await transportReqToMicroservice(
      this.pageService,
      CategoryEvents.CategoryGetAll,
      {
        type: CategoryType.Category,
      },
    );
    const tags = await transportReqToMicroservice(
      this.pageService,
      CategoryEvents.CategoryGetAll,
      {
        type: CategoryType.Tag,
      },
    );
    const friends = await this.getFriendsVariables().catch((e) => {
      consola.error(`获取友链失败：${e}`);
    });
    return {
      pages,
      posts,
      categories,
      tags,
      friends,
    };
  }
  /**
   * 评论变量，需要传入pid
   */
  async getCommentsVariables(pid: string) {
    return await transportReqToMicroservice(
      this.commentsService,
      CommentsEvents.CommentsGetWithPostId,
      {
        pid,
        isMaster: false,
      },
    );
  }
  /**
   * 适用范围：首页
   */
  async getIndexPageVariables(query: { [key: string]: string }) {
    const pager: PagerDto = {
      page: Number(getValueFromQuery(query, 'page', '1')),
      size: Number(getValueFromQuery(query, 'size', '10')),
      select: getValueFromQuery(query, 'select', ''),
      sortBy: getValueFromQuery(query, 'sortBy', ''),
      sortOrder:
        (Number(getValueFromQuery(query, 'sortOrder', undefined)) as 1 | -1) ||
        1,
      year: Number(getValueFromQuery(query, 'year', undefined)) || undefined,
      status:
        Number(getValueFromQuery(query, 'status', undefined)) || undefined,
    };
    return await transportReqToMicroservice(
      this.pageService,
      PostEvents.PostsListGet,
      {
        query: plainToInstance(PagerDto, pager),
        isMaster: false,
      },
    );
  }
  async getArchivesPageVariables() {
    const res = await transportReqToMicroservice(
      this.pageService,
      PostEvents.PostsListGetAll,
      {},
    );
    return {
      data: {
        children: res,
      },
    };
  }
  /**
   * 页面变量，包含评论内容
   */
  async getPageVariables(
    params: { [key: string]: string },
    req: FastifyRequest,
  ) {
    // const slug = getValueFromQuery(params, 'slug', undefined);
    const slug = req.url.split('/')[1];
    if (!slug) {
      return {};
    }
    const password = (req.body as { password?: string })?.password;
    const page = await transportReqToMicroservice(
      this.pageService,
      PageEvents.PageGet,
      {
        slug,
        password,
        isMaster: false,
      },
    );
    const comments = this.getCommentsVariables(page._id);
    return {
      ...page,
      comments,
    };
  }
  /**
   * 文章变量，包含评论内容
   */
  async getPostVariables(
    params: { [key: string]: string },
    req: FastifyRequest,
  ) {
    const category = getValueFromQuery(params, 'category', undefined);
    const slug = getValueFromQuery(params, 'slug', undefined);
    if (!slug || !category) {
      return {};
    }
    const password = (req.body as { password?: string })?.password;
    const post = await transportReqToMicroservice(
      this.pageService,
      PostEvents.PostGet,
      {
        category,
        slug,
        isMaster: false,
        password,
      },
    );
    const comments = await this.getCommentsVariables(post._id);
    return {
      ...post,
      comments,
    };
  }
  /**
   * 分类或标签变量，包含分类或标签下的文章列表
   */
  async getCategoryOrTagVariables(req: FastifyRequest) {
    const name = req.url.split('/')[2];
    const _tag = req.url.split('/')[1] === 'tag';
    const res = await transportReqToMicroservice(
      this.pageService,
      CategoryEvents.CategoryGet,
      {
        _query: name,
        _tag,
      },
    );
    return res;
  }
  /**
   * 获取友链变量
   */
  async getFriendsVariables() {
    return await transportReqToMicroservice(
      this.friendsService,
      FriendsEvents.FriendsGetList,
      {},
    );
  }
  /**
   * 页面变量，包含页面标题等 (Like Hexo)
   */
  async getAnyPageVariables(
    query: { [key: string]: string },
    params: { [key: string]: string },
    layout: ThemeEnum,
    req: FastifyRequest,
  ) {
    switch (layout) {
      case ThemeEnum.index:
        return await this.getIndexPageVariables(query);
      case ThemeEnum.page:
        return await this.getPageVariables(params, req);
      case ThemeEnum.post:
        return await this.getPostVariables(params, req);
      case ThemeEnum.friends:
        return await this.getFriendsVariables();
      case ThemeEnum.archives:
        // eslint-disable-next-line no-case-declarations
        const type = req.url.split('/')[1];
        if (type === 'archives') {
          return {
            ...(await this.getArchivesPageVariables()),
            isCategory: false,
          };
        } else if (type === 'posts') {
          return await this.getIndexPageVariables(query);
        } else {
          return {
            ...(await this.getCategoryOrTagVariables(req)),
            isCategory: true,
          };
        }
      default:
        return {};
    }
  }
  async getConfigVariables() {
    const config = await transportReqToMicroservice(
      this.configService,
      ConfigEvents.ConfigGetAllByMaster,
      {},
    );
    const user = await transportReqToMicroservice(
      this.userService,
      UserEvents.UserGetMaster,
      {},
    );
    return {
      ...config,
      user,
    };
  }
  async getThemeVariables() {
    const json: {
      name: string;
      key: string;
      type: string;
      value: string;
    }[] = JSON.parse(
      (
        await transportReqToMicroservice(
          this.configService,
          ConfigEvents.ConfigGetByMaster,
          'themes',
        )
      ).filter(
        (item) =>
          item.id ===
          JSON.parse(process.env.MOG_PRIVATE_INNER_ENV || '{}')?.theme,
      )?.[0].config || '{}',
    );
    const theme = Object.fromEntries(
      Object.entries(json).map(([_key, value]) => {
        return [value.key, value.value];
      }),
    );
    const env = JSON.parse(process.env.MOG_PRIVATE_INNER_ENV || '{}')?.theme;
    let yaml: string | null;
    try {
      yaml = fs.readFileSync(path.join(THEME_DIR, env, 'i18n.yaml'), 'utf8');
    } catch (error) {
      yaml = null;
    }
    const i18n = yaml ? YAML.parse(yaml) : {};
    const language = YAML.parse(
      fs.readFileSync(path.join(THEME_DIR, env, 'config.yaml'), 'utf8'),
    );
    i18n.language = language.language;
    return {
      ...theme,
      i18n,
    };
  }
  async getPathVariables(request: FastifyRequest) {
    return request.url.split('?')[0].replace(/http[s]?:\/\/[^/]+/, '');
  }
  async getURLVariables(
    request: FastifyRequest,
    query: { [key: string]: string },
    params: { [key: string]: string },
  ) {
    const url = request.url;
    const path = url.split('?')[0];
    const origin = request.headers.origin;
    const host = request.headers.host;
    const protocol = request.protocol;
    return {
      url: `${protocol}://${host}${path}`,
      path,
      query,
      params,
      origin,
      host,
      protocol,
    };
  }

  async getAllVariables(
    layout: ThemeEnum,
    query: { [key: string]: string },
    params: { [key: string]: string },
    request: FastifyRequest,
  ) {
    const siteVariables = await this.getSiteVariables().catch((e) => {
      consola.error(`[Site] ${e.message}`);
      return {} as any;
    });
    const pageVariables = await this.getAnyPageVariables(
      query,
      params,
      layout,
      request,
    ).catch((e) => {
      consola.error(`[Page] ${e.message}`);
      return {} as any;
    });
    const configVariables = await this.getConfigVariables().catch((e) => {
      consola.error(`[Config] ${e.message}`);
      return {} as any;
    });
    const themeVariables = await this.getThemeVariables().catch((e) => {
      consola.error(`[Theme] ${e.message}`);
      return {} as any;
    });
    const pathVariables = await this.getPathVariables(request).catch((e) => {
      consola.error(`[Path] ${e.message}`);
      return '';
    });
    const urlVariables = await this.getURLVariables(
      request,
      query,
      params,
    ).catch((e) => {
      consola.error(`[URL] ${e.message}`);
      return {} as any;
    });
    return {
      site: siteVariables,
      page: pageVariables,
      config: configVariables,
      theme: themeVariables,
      path: pathVariables,
      url: urlVariables,
    };
  }

  /**
   * 获取需要注入的辅助函数列表
   */
  async injectHelpers(vars: any) {
    const theme =
      JSON.parse(process.env.MOG_PRIVATE_INNER_ENV || '{}')?.theme || undefined;
    if (!theme) {
      return;
    }
    const plugins: string[] = [];
    function readDir(_path: string) {
      try {
        fs.readdirSync(path.join(THEME_DIR, theme, _path), {
          withFileTypes: true,
        })
          .filter((dirent) => dirent.isDirectory()) // 过滤文件夹
          .forEach((theme) => {
            const _theme = path.join(_path, theme.name);
            readDir(_theme);
          });
        fs.readdirSync(path.join(THEME_DIR, theme, _path), {
          withFileTypes: true,
        })
          .filter((dirent) => dirent.isFile())
          .forEach((file) => {
            const _file = path.join(_path, file.name);
            if (file.name.endsWith('.js')) {
              plugins.push(_file);
            }
          });
      } catch (e) {
        return [];
      }
    }
    readDir('plugins');
    for (let i = 0; i < plugins.length; i++) {
      plugins[i] = path.join(THEME_DIR, theme, plugins[i]);
    }
    for (let i = 0; i < plugins.length; i++) {
      const _item = require(plugins[i]);
      plugins[_item.name] = Function(
        `
        const theme = ${JSON.stringify(vars.theme)};
        const site = ${JSON.stringify(vars.site)};
        const page = ${JSON.stringify(vars.page)};
        const config = ${JSON.stringify(vars.config)};
        const path = ${JSON.stringify(vars.path)};
        const url = ${JSON.stringify(vars.url)}; 
        return ${_item[_item.name].toString().replace(/(\r\n|\n|\r)/gm, '')}`,
      )(); // 转换为函数
      delete plugins[i]; // 删除原来的
    }
    plugins['CONSTANTS'] = {
      THEME_DIR,
    };
    plugins['isDev'] = isDev;
    plugins['_i'] = Function(
      `
      const theme = ${JSON.stringify(vars.theme)};
      const site = ${JSON.stringify(vars.site)};
      const page = ${JSON.stringify(vars.page)};
      const config = ${JSON.stringify(vars.config)};
      const path = ${JSON.stringify(vars.path)};
      const url = ${JSON.stringify(vars.url)};
      return function(key) {
        const i18nConfig = theme.i18n;
        const nowLanguage = i18nConfig.language;
        const nowLanguageI18nConfig = i18nConfig[nowLanguage];
        const nowLanguageI18nConfigKeys = Object.keys(nowLanguageI18nConfig);
        if (nowLanguageI18nConfigKeys.includes(key)) {
          return nowLanguageI18nConfig[key];
        } else {
          return key;
        }
      }
      `,
    )();
    return plugins;
  }
}
