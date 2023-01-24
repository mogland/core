import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FastifyRequest } from 'fastify';
import { CategoryType } from '~/apps/page-service/src/model/category.model';
import { ConfigService } from '~/libs/config/src';
import {
  CategoryEvents,
  PageEvents,
  PostEvents,
} from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PagerDto } from '~/shared/dto/pager.dto';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import { getValueFromQuery } from '~/shared/utils/query-param';

enum ThemeEnum {
  page = 'page',
  post = 'post',
  category = 'category',
  tag = 'tag',
  archive = 'archive',
  index = 'index',
}

@Injectable()
export class ThemesRenderService {
  private activeTheme;
  constructor(
    @Inject(ServicesEnum.page) private readonly pageService: ClientProxy,
    @Inject(ServicesEnum.user) private readonly userService: ClientProxy,
    @Inject(ServicesEnum.friends) private readonly friendsService: ClientProxy,
    @Inject(ServicesEnum.comments)
    private readonly commentsService: ClientProxy,
    private readonly configService: ConfigService,
  ) {
    this.activeTheme =
      JSON.parse(process.env.MOG_PRIVATE_INNER_ENV || '{}')?.theme || undefined;
  }

  /**
   * 网站变量，包含全部文章、页面、分类、标签
   */
  async getSiteVariables() {
    const pages = await transportReqToMicroservice(
      this.pageService,
      PageEvents.PagesGetAll,
      {},
      true,
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
    return {
      pages,
      posts,
      categories,
      tags,
    };
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
        undefined,
      year: Number(getValueFromQuery(query, 'year', undefined)) || undefined,
      status:
        Number(getValueFromQuery(query, 'status', undefined)) || undefined,
    };
    return await transportReqToMicroservice(
      this.pageService,
      PostEvents.PostsListGet,
      {
        pager,
        isMaster: false,
      },
      true,
    );
  }
  async getPageVariables(
    params: { [key: string]: string },
    req: FastifyRequest,
  ) {
    const slug = getValueFromQuery(params, 'slug', undefined);
    const password = (req.body as { password?: string })?.password;
    return await transportReqToMicroservice(
      this.pageService,
      PageEvents.PageGet,
      {
        slug,
        password,
        isMaster: false,
      },
      true,
    );
  }
  async getPostVariables(
    params: { [key: string]: string },
    req: FastifyRequest,
  ) {
    const category = getValueFromQuery(params, 'category', undefined);
    const slug = getValueFromQuery(params, 'slug', undefined);
    const password = (req.body as { password?: string })?.password;
    return await transportReqToMicroservice(
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
  }
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
      case ThemeEnum.category:
      case ThemeEnum.tag:
        return await this.getCategoryOrTagVariables(params, layout);
      default:
        return {};
    }
  }
  async getConfigVariables() {}
  async getThemeVariables() {}
  async getPathVariables() {}
  async getURLVariables() {}
  async getEnvVariables() {}

  async getAllVariables(
    request: FastifyRequest,
    query: { [key: string]: string },
    params: { [key: string]: string },
    layout: ThemeEnum,
  ) {
    const siteVariables = await this.getSiteVariables();
    const pageVariables = await this.getAnyPageVariables(
      query,
      params,
      layout,
      request,
    );
    const configVariables = await this.getConfigVariables();
    const themeVariables = await this.getThemeVariables();
    const pathVariables = await this.getPathVariables();
    const urlVariables = await this.getURLVariables();
    const envVariables = await this.getEnvVariables();
    return {
      site: siteVariables,
      page: pageVariables,
      config: configVariables,
      theme: themeVariables,
      path: pathVariables,
      url: urlVariables,
      env: envVariables,
    };
  }
}
