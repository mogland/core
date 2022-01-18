import { Injectable } from "@nestjs/common";
import { PostsService } from "modules/posts/posts.service";
import { PagesService } from "modules/pages/pages.service";
import { CommentService } from "modules/comment/comment.service";
import { FriendsService } from "modules/friends/friends.service";
import { CategoryService } from "modules/category/category.service";

@Injectable()
export class AppService {
  constructor(
    private postsService: PostsService,
    private pageService: PagesService,
    private commentService: CommentService,
    private friendsService: FriendsService,
    private categoryService: CategoryService,
  ){}

  async getStat(): Promise<any> {
    return {
      posts: await this.postsService.list({ type: 'num' }),
      pages: await this.pageService.list({ type: 'num' }),
      comments: await this.commentService.list({ type: 'num' }),
      Allfriends: await this.friendsService.list({ type: 'num' }),
      Unfriends: await this.friendsService.list({ type: 'uncheck_num' }),
      categories: await this.categoryService.list({ type: 'num' }),
    }
  }

  getHello(): string {
    return "Hello World!";
  }
  
}
