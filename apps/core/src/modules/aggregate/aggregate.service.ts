/*
 * @FilePath: /mog-core/apps/core/src/modules/aggregate/aggregate.service.ts
 * @author: Wibus
 * @Date: 2022-10-01 19:52:38
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-01 20:50:46
 * Coding With IU
 */

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { pick } from 'lodash';
import { CategoryService } from '~/apps/page-service/src/category.service';
import { CategoryModel } from '~/apps/page-service/src/model/category.model';
import { PageService } from '~/apps/page-service/src/page-service.service';
import { PostService } from '~/apps/page-service/src/post-service.service';
import { CacheService } from '~/libs/cache/src';
import { CacheKeys } from '~/shared/constants/cache.constant';
import { RSSProps } from './aggregate.interface';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigEvents } from '~/shared/constants/event.constant';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

@Injectable()
export class AggregateService {
  constructor(
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    @Inject(forwardRef(() => PageService))
    private readonly pageService: PageService,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    @Inject(ServicesEnum.config)
    private readonly configService: ClientProxy,
    private readonly redis: CacheService,
  ) {}

  getAllCategory() {
    return this.categoryService.getAllCategories();
  }

  getAllPages() {
    return this.pageService.model
      .find({}, 'title _id slug order')
      .sort({
        order: -1,
        modified: -1,
      })
      .lean();
  }

  /**
   * findTop 查询最新文章
   * @param model 模型
   * @param condition 查询条件
   * @param size 获取数量
   */
  private findTop<
    U extends AnyParamConstructor<any>,
    T extends ReturnModelType<U>,
  >(model: T, condition = {}, size = 6) {
    // 获取置顶文章
    return model
      .find(condition)
      .sort({ created: -1 })
      .limit(size)
      .select('_id title name slug created text');
  }

  /**
   * topActivity 查询最新文章
   * @param size 获取数量
   * @param isMaster 是否主人
   */
  async topActivity(size = 6, isMaster = false) {
    const [posts] = await Promise.all([
      this.findTop(
        this.postService.model,
        !isMaster ? { hide: false } : {},
        size,
      )
        .populate('categoryId')
        .lean()
        .then((res) => {
          return res.map((post) => {
            post.category = pick(post.categoryId, ['name', 'slug']);
            delete post.categoryId;
            return post;
          });
        }),
    ]);

    return { posts };
  }

  /**
   * getSiteMapContent 获取站点地图
   */
  async getSiteMapContent() {
    // const {
    //   urls: { webUrl: baseURL },
    // } = await this.configService.waitForConfigReady();
    const combineTasks = await Promise.all([
      this.postService.model
        .find({
          hide: false, // 只获取发布的文章
          password: { $nq: null }, // 只获取没有密码的文章
          rss: true, // 只获取公开RSS的文章
        })
        .populate('category')
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
                // baseURL
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
    // const {
    //   urls: { webUrl },
    // } = await this.configService.waitForConfigReady();

    // const baseURL = webUrl.replace(/\/$/, "");

    const [posts] = await Promise.all([
      await this.postService.model
        .find({
          hide: false,
          rss: true,
        })
        .limit(10)
        .sort({ created: -1 })
        .populate('category')
        .then((list) => {
          // 如果文章存在密码，则不获取
          return list.filter((document) => {
            return document.password === null;
          });
        }),
    ]);
    const postsRss: RSSProps['data'] = posts.map((post) => {
      return {
        id: String(post._id),
        title: post.title,
        text: post.text,
        created: post.created!,
        modified: post.modified || null,
        // link: baseURL + this.urlService.build(post),
      };
    });
    return postsRss
      .sort((a, b) => b.created!.getTime() - a.created!.getTime())
      .slice(0, 10);
  }

  /**
   * buildRssStructure 构建RSS结构
   * @returns {Promise<RSSProps>}
   */
  async buildRssStructure(): Promise<RSSProps> {
    const data = await this.getRSSFeedContent();
    const title = (await transportReqToMicroservice(
      this.configService,
      ConfigEvents.ConfigGetByMaster,
      'seo',
    )).title || '';
    return {
      title,
      data,
    };
  }

  async getCounts() {
    const [posts, pages, categories] = await Promise.all([
      this.postService.model.countDocuments({
        hide: false,
        password: { $nq: null },
        rss: true,
      }),
      this.pageService.model.countDocuments(),
      this.categoryService.model.countDocuments(),
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
