import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { FastifyRequest } from 'fastify';
import { CategoryType } from '~/apps/page-service/src/model/category.model';
import { ConfigService } from '~/libs/config/src';
import {
  CategoryEvents,
  CommentsEvents,
  PageEvents,
  PostEvents,
} from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PagerDto } from '~/shared/dto/pager.dto';
import { consola } from '~/shared/global/consola.global';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import { getValueFromQuery } from '~/shared/utils/query-param';

export enum ThemeEnum {
  page = 'page',
  post = 'post',
  category = 'category',
  tag = 'tag',
  archives = 'archives',
  index = 'index',
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
      consola.error(e);
      return {};
    });
    const pageVariables = await this.getAnyPageVariables(
      query,
      params,
      layout,
      request,
    ).catch((e) => {
      consola.error(e);
      return {};
    });
    const configVariables = await this.getConfigVariables().catch((e) => {
      consola.error(e);
      return {};
    });
    const themeVariables = await this.getThemeVariables().catch((e) => {
      consola.error(e);
      return {};
    });
    const pathVariables = await this.getPathVariables(request).catch((e) => {
      consola.error(e);
      return '';
    });
    const urlVariables = await this.getURLVariables(
      request,
      query,
      params,
    ).catch((e) => {
      consola.error(e);
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
}
