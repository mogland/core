/*
 * @FilePath: /nx-core/src/modules/theme/theme.interface.ts
 * @author: Wibus
 * @Date: 2022-08-13 23:14:55
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-15 11:55:53
 * Coding With IU
 */

import { AggregatePaginateResult } from "mongoose";
import { CategoryModel } from "../category/category.model";
import { CommentModel } from "../comments/comments.model";
import { SiteDto, ThemeDto, UrlsDto } from "../configs/configs.dto";
import { PageModel } from "../page/page.model";
import { PostModel } from "../post/post.model";

interface SiteThemeInterface {
  posts: PostModel[]; // 博客文章
  pages: PageModel[]; // 页面
  categories: CategoryModel[]; // 分类
  tags: CategoryModel[]; // 标签
}

interface ConfigsThemeInterface {
  urls: UrlsDto, // 站点地址
  site: SiteDto, // 站点设置
  theme: ThemeDto, // 主题设置
}

export interface ThemeBasicInterface {
  site: SiteThemeInterface, // 网站变量
  configs: ConfigsThemeInterface, // 网站配置
  path: string, // 页面路径
}
export interface IndexThemeInterface extends ThemeBasicInterface {
  aggregate: any, // 当前页面的文章列表
}

export interface PostThemeInterface extends ThemeBasicInterface {
  page: PostModel, // 针对该页面的内容
  comments: CommentModel[] | null, // 评论列表
}

export interface PageThemeInterface extends ThemeBasicInterface {
  page: PageModel, // 针对该页面的内容
  comments: CommentModel[] | null, // 评论列表
}

export interface CategoryModelForTheme {
  // children: PostModel[]
  [key: string]: any;
}

export interface TagModelForTheme {
  tag: string,
  data: PostModel[]
}

export interface CategoryThemeInterface extends ThemeBasicInterface {
  page: CategoryModelForTheme , // 针对该页面的内容
}

export interface TagThemeInterface extends ThemeBasicInterface {
  page: TagModelForTheme, // 针对该页面的内容
}