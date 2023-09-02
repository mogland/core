/*
 * @FilePath: /mog-core/apps/core/src/modules/aggregate/aggregate.service.ts
 * @author: Wibus
 * @Date: 2022-10-01 19:52:38
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-01 20:50:46
 * Coding With IU
 */

import { Inject, Injectable } from '@nestjs/common';
import { CategoryModel } from '~/apps/page-service/src/model/category.model';
import { CacheService } from '~/libs/cache/src';
import { CacheKeys } from '~/shared/constants/cache.constant';
import { RSSProps } from './aggregate.interface';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import {
  CategoryEvents,
  ConfigEvents,
  PageEvents,
  PostEvents,
} from '~/shared/constants/event.constant';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import { PostModel } from '~/apps/page-service/src/model/post.model';

@Injectable()
export class AggregateService {
  constructor(
    @Inject(ServicesEnum.page)
    private readonly pageService: ClientProxy,
    @Inject(ServicesEnum.config)
    private readonly configService: ClientProxy,
    private readonly redis: CacheService,
  ) {}

  async getAllCategory() {
    // return this.categoryService.getAllCategories();
    return await transportReqToMicroservice(
      this.pageService,
      CategoryEvents.CategoryGetAll,
      {},
    );
  }

  async getAllPages() {
    return await transportReqToMicroservice(
      this.pageService,
      PageEvents.PagesGetAll,
      {},
    );
  }

  /**
   * topActivity 查询最新文章
   * @param size 获取数量
   * @param isMaster 是否主人
   */
  async topActivity(size = 6, isMaster = false) {
    const posts = await transportReqToMicroservice<PostModel[]>(
      this.pageService,
      PostEvents.PostGetTopActivity,
      {
        size,
        isMaster,
      },
    );
    return posts;
  }

  /**
   * getSiteMapContent 获取站点地图
   */
  async getSiteMapContent() {
    // const {
    //   urls: { webUrl: baseURL },
    // } = await this.configService.waitForConfigReady();
    const { frontUrl: baseURL } = await transportReqToMicroservice(
      this.configService,
      ConfigEvents.ConfigGetByMaster,
      'site',
    );
    const combineTasks = await Promise.all([
      transportReqToMicroservice<PostModel[]>( // FIX: Maybe here will be crash.
        this.pageService,
        PostEvents.PostsListGetAll,
        {
          hide: false,
          password: false,
          rss: true,
        },
      )
        .then((list) => {
          // 如果文章存在密码，则不获取
          return list.filter((document) => {
            return document.password === null;
          });
        })
        .then((list) =>
          list.map((document) => {
            return {
              url: new URL(
                `/posts/${(document.category as CategoryModel).slug}/${
                  document.slug
                }`,
                baseURL,
              ),
              published_at: document.modified
                ? new Date(document.modified)
                : new Date(document.created!),
            };
          }),
        ),
    ]);
    return combineTasks.flat(1).sort((a, b) => {
      return -a.published_at.getTime() - b.published_at.getTime();
    });
  }

  /**
   * getRSSFeedContent 获取RSS内容
   */
  async getRSSFeedContent() {
    const { frontUrl: baseURL } = await transportReqToMicroservice(
      this.configService,
      ConfigEvents.ConfigGetByMaster,
      'site',
    );

    const [posts] = await Promise.all([
      transportReqToMicroservice<PostModel[]>( // FIX: Maybe here will be crash.
        this.pageService,
        PostEvents.PostsListGetAll,
        {
          hide: false,
          password: false,
          rss: true,
        },
      ).then((list) => {
        return list.filter((document) => {
          return document.password === null;
        });
      }),
    ]);
    const postsRss: RSSProps['data'] = posts.map((post) => {
      return {
        id: String(post.id),
        title: post.title,
        text: post.text,
        created: post.created!,
        modified: post.modified || null,
        link: new URL(
          `/posts/${(post.category as CategoryModel).slug}/${post.slug}`,
          baseURL,
        ),
      };
    });
    return (
      postsRss
        // created 传输过来会自动从 Date 转换为 String，所以需要重新转换
        .sort(
          (a, b) =>
            new Date(b.created as any).getTime() -
            new Date(a.created as any).getTime(),
        )
        .slice(0, 10)
    );
  }

  /**
   * buildRssStructure 构建RSS结构
   * @returns {Promise<RSSProps>}
   */
  async buildRssStructure(): Promise<RSSProps> {
    const data = await this.getRSSFeedContent();
    const title =
      (
        await transportReqToMicroservice(
          this.configService,
          ConfigEvents.ConfigGetByMaster,
          'seo',
        )
      ).title || '';
    return {
      title,
      data,
    };
  }

  async getCounts() {
    async function countDocuments(
      client: ClientProxy,
      event: string,
      options?: any,
    ): Promise<number> {
      const list = await transportReqToMicroservice(client, event, options || {});
      return list.length;
    }

    const [posts, pages, categories] = await Promise.all([
      countDocuments(this.pageService, PostEvents.PostsListGetAll),
      countDocuments(this.pageService, PageEvents.PagesGetAll),
      countDocuments(this.pageService, CategoryEvents.CategoryGetAll),
    ]);

    return {
      posts,
      pages,
      categories,
    };
  }

  public clearAggregateCache() {
    return Promise.all([
      this.redis.getClient().del(CacheKeys.RSS),
      this.redis.getClient().del(CacheKeys.RSSXmlCatch),
      this.redis.getClient().del(CacheKeys.AggregateCatch),
      this.redis.getClient().del(CacheKeys.SiteMapCatch),
      this.redis.getClient().del(CacheKeys.SiteMapXmlCatch),
    ]);
  }
}
