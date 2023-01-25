import { Inject, Injectable } from '@nestjs/common';
import fs from 'fs';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import { CategoryType } from '~/apps/page-service/src/model/category.model';
import { ConfigService } from '~/libs/config/src';
import {
  CategoryEvents,
  CommentsEvents,
  FriendsEvents,
  PageEvents,
  PostEvents,
} from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PagerDto } from '~/shared/dto/pager.dto';
import { consola } from '~/shared/global/consola.global';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import { getValueFromQuery } from '~/shared/utils/query-param';
import { THEME_DIR } from '~/shared/constants/path.constant';

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
    private readonly configService: ConfigService,
  ) {}

  /**
   * 网站变量，包含全部文章、页面、分类、标签
   */
  async getSiteVariables() {
    const pages = await transportReqToMicroservice(
      this.pageService,
      PageEvents.PagesGetAll,
      {},
      true,
      // @ts-ignore
    );
    const posts = await transportReqToMicroservice(
      this.pageService,
      PostEvents.PostsListGetAll,
      {},
      true,
    );
    const categories = await transportReqToMicroservice(
      this.pageService,
      CategoryEvents.CategoryGetAll,
      {
        type: CategoryType.Category,
      },
      true,
    );
    const tags = await transportReqToMicroservice(
      this.pageService,
      CategoryEvents.CategoryGetAll,
      {
        type: CategoryType.Tag,
      },
      true,
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
      true,
    );
  }
  /**
   * 适用范围：首页、归档页
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
      true,
    );
  }
  /**
   * 页面变量，包含评论内容
   */
  async getPageVariables(
    params: { [key: string]: string },
    req: FastifyRequest,
  ) {
    const slug = getValueFromQuery(params, 'slug', undefined);
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
      true,
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
      true,
    );
    const comments = this.getCommentsVariables(post._id);
    return {
      ...post,
      comments,
    };
  }
  /**
   * 分类或标签变量，包含分类或标签下的文章列表
   */
  async getCategoryOrTagVariables(
    params: { [key: string]: string },
    layout: ThemeEnum,
  ) {
    const name = getValueFromQuery(params, 'name', undefined);
    const _tag = layout === ThemeEnum.tag ? true : undefined;
    return await transportReqToMicroservice(
      this.pageService,
      CategoryEvents.CategoryGet,
      {
        _query: name,
        _tag,
      },
      true,
    );
  }
  /**
   * 获取友链变量
   */
  async getFriendsVariables() {
    return await transportReqToMicroservice(
      this.friendsService,
      FriendsEvents.FriendsGetList,
      {},
      true,
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
      case ThemeEnum.category:
      case ThemeEnum.tag:
        return await this.getCategoryOrTagVariables(params, layout);
      default:
        return {};
    }
  }
  async getConfigVariables() {
    return await this.configService.getAllConfigs();
  }
  async getThemeVariables() {
    return (await this.configService.get('themes')).filter(
      (item) =>
        item.id ===
        JSON.parse(process.env.MOG_PRIVATE_INNER_ENV || '{}')?.theme,
    )?.[0];
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
      url,
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
      return {};
    });
    const pageVariables = await this.getAnyPageVariables(
      query,
      params,
      layout,
      request,
    ).catch((e) => {
      consola.error(`[Page] ${e.message}`);
      return {};
    });
    const configVariables = await this.getConfigVariables().catch((e) => {
      consola.error(`[Config] ${e.message}`);
      return {};
    });
    const themeVariables = await this.getThemeVariables().catch((e) => {
      consola.error(`[Theme] ${e.message}`);
      return {};
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
      return {};
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
  async injectHelpers() {
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
        `return ${_item[_item.name].toString().replace(/(\r\n|\n|\r)/gm, '')}`,
      )(); // 转换为函数
      delete plugins[i]; // 删除原来的
    }
    return plugins;
  }
}
