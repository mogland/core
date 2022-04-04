import { Injectable } from "@nestjs/common";
import { PostsService } from "./modules/posts/posts.service";
import { PagesService } from "./modules/pages/pages.service";
import { CommentsService } from "./modules/comments/comments.service";
import { FriendsService } from "./modules/friends/friends.service";
import { CategoriesService } from "./modules/categories/categories.service";
import { GHttp } from "helper/helper.http.service";

@Injectable()
export class AppService {
  constructor(
    private postsService: PostsService, // 文章
    private pageService: PagesService, // 页面
    private commentsService: CommentsService, // 评论
    private friendsService: FriendsService, // 好友
    private categoriesService: CategoriesService, // 分类
    private http: GHttp
  ) {}

  async getStat(): Promise<any> {
    return {
      posts: await this.postsService.list({ type: 'num' }), // 文章数
      pages: await this.pageService.list({ type: 'num' }), // 页面数
      comments: await this.commentsService.list({ type: 'num' }), // 评论数
      unReadComments: await this.commentsService.list({ type: 'uncheck_num' }), // 未审核评论数
      Allfriends: await this.friendsService.list({ type: 'num' }), // 好友数
      Unfriends: await this.friendsService.list({ type: 'uncheck_num' }), // 未审核好友数
      categories: await this.categoriesService.list({ type: 'num' }), // 分类数
    }
  }

  async checkUpdate() {
    const api = 'https://api.github.com/repos/wibus-wee/GS-server/releases/latest';
    const update = await this.http.axiosRef
      .get(api, {})
      .then((res) => {
        return res.data
      })
    const tag_name = update.tag_name;
    const version = tag_name.substr(1);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const currentVersion = require('../package.json').version;
    if (version > currentVersion) {
      return {
        mes: "有新版本啦！",
        version: version,
      }
    } else {
      return {
        mes: "当前为最新版本！",
      }
    }
  }

  getHello(): string {
    return "Hello World!";
  }
  
}
