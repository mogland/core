import { Injectable } from "@nestjs/common";
import { PostsService } from "./modules/posts/posts.service";
import { PagesService } from "./modules/pages/pages.service";
import { CommentsService } from "./modules/comments/comments.service";
import { FriendsService } from "./modules/friends/friends.service";
import { CategoriesService } from "./modules/categories/categories.service";

@Injectable()
export class AppService {
  constructor(
    private postsService: PostsService, // 文章
    private pageService: PagesService, // 页面
    private CommentsService: CommentsService, // 评论
    private friendsService: FriendsService, // 好友
    private CategoriesService: CategoriesService, // 分类
  ) {}

  async getStat(): Promise<any> {
    return {
      posts: await this.postsService.list({ type: 'num' }), // 文章数
      pages: await this.pageService.list({ type: 'num' }), // 页面数
      Comments: await this.CommentsService.list({ type: 'num' }), // 评论数
      unReadComments: await this.CommentsService.list({ type: 'uncheck_num' }), // 未审核评论数
      Allfriends: await this.friendsService.list({ type: 'num' }), // 好友数
      Unfriends: await this.friendsService.list({ type: 'uncheck_num' }), // 未审核好友数
      categories: await this.CategoriesService.list({ type: 'num' }), // 分类数
    }
  }

  getHello(): string {
    return "Hello World!";
  }
  
}
