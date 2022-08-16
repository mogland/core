/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { AnyParamConstructor } from "@typegoose/typegoose/lib/types";
import { pick } from "lodash";
import { CacheKeys } from "~/constants/cache.constant";
import { CacheService } from "~/processors/cache/cache.service";
import { UrlService } from "~/processors/helper/helper.url.service";
import { CategoryModel } from "../category/category.model";
import { CategoryService } from "../category/category.service";
import { CommentStatus } from "../comments/comments.model";
import { CommentService } from "../comments/comments.service";
import { ConfigsService } from "../configs/configs.service";
import { PageService } from "../page/page.service";
import { PostService } from "../post/post.service";
import { RSSProps } from "./aggregate.interface";

@Injectable()
export class AggregateService {
  constructor(
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    @Inject(forwardRef(() => PageService))
    private readonly pageService: PageService,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    @Inject(forwardRef(() => CommentService))
    private readonly commentService: CommentService,

    private readonly configsService: ConfigsService,
    private readonly redis: CacheService,
    private readonly urlService: UrlService
  ) { }

  /**
   * getAllCategory 获取所有分类
   */
  getAllCategory() {
    return this.categoryService.findAllCategory();
  }

  getAllPages() {
    return this.pageService.model
      .find({}, "title _id slug order")
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
    T extends ReturnModelType<U>
  >(model: T, condition = {}, size = 6) {
    // 获取置顶文章
    return model
      .find(condition) // 获取所有文章
      .sort({ created: -1 }) // 按照时间降序
      .limit(size) // 获取篇目
      .select("_id title name slug avatar nid created text"); // 获取文章的id、标题、slug、作者、创建时间、内容
  }

  /**
   * topActivity 查询最新文章
   * @param size 获取数量
   * @param isMaster 是否主人
   */
  async topActivity(size = 6, isMaster = false) {
    const [posts, comments] = await Promise.all([
      this.findTop(
        this.postService.model,
        !isMaster ? { hide: false } : {},
        size
      )
        .populate("categoryId")
        .lean()
        .then((res) => {
          return res.map((post) => {
            post.category = pick(post.categoryId, ["name", "slug"]);
            delete post.categoryId;
            return post;
          });
        }),
      this.commentService.getComments().then((res) => {
        return res.docs
      })
    ]);

    return { posts, comments };
  }

  /**
   * getSiteMapContent 获取站点地图
   */
  async getSiteMapContent() {
    const {
      urls: { webUrl: baseURL },
    } = await this.configsService.waitForConfigReady();
    const combineTasks = await Promise.all([
      this.postService.model
        .find({
          hide: false, // 只获取发布的文章
          password: { $nq: null }, // 只获取没有密码的文章
          rss: true, // 只获取公开RSS的文章
        })
        .populate("category")
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
                `/posts/${(document.category as CategoryModel).slug}/${document.slug
                }`,
                baseURL
              ),
              published_at: document.modified
                ? new Date(document.modified)
                : new Date(document.created!),
            };
          })
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
    const {
      urls: { webUrl },
    } = await this.configsService.waitForConfigReady();

    const baseURL = webUrl.replace(/\/$/, "");

    const [posts] = await Promise.all([
      await this.postService.model
        .find({
          hide: false,
          rss: true,
        })
        .limit(10)
        .sort({ created: -1 })
        .populate("category")
        .then((list) => {
          // 如果文章存在密码，则不获取
          return list.filter((document) => {
            return document.password === null;
          });
        }),
    ]);
    const postsRss: RSSProps["data"] = posts.map((post) => {
      return {
        id: post._id,
        title: post.title,
        text: post.text,
        created: post.created!,
        modified: post.modified || null,
        link: baseURL + this.urlService.build(post),
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
    const title = (await this.configsService.get("site")).title;
    const author = (await this.configsService.getMaster()).name;
    const url = (await this.configsService.get("urls")).webUrl;
    return {
      title,
      author,
      url,
      data,
    };
  }

  /**
   * getCounts 获取数量
   */
  async getCounts() {
    const [posts, pages, categories, comments, allComments, unreadComments] =
      await Promise.all([
        this.postService.model.countDocuments({
          hide: false,
          password: { $nq: null },
          rss: true,
        }),
        this.pageService.model.countDocuments(),
        this.categoryService.model.countDocuments(),
        this.commentService.model.countDocuments({
          parent: null,
          $or: [{ state: CommentStatus.Read }, { state: CommentStatus.Unread }],
        }),
        this.commentService.model.countDocuments({
          $or: [{ state: CommentStatus.Read }, { state: CommentStatus.Unread }],
        }),
        this.commentService.model.countDocuments({
          state: CommentStatus.Unread,
        }),
      ]);

    return {
      posts,
      pages,
      categories,
      comments,
      allComments,
      unreadComments,
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
