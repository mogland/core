import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PostsService } from "./modules/posts/posts.service";
import { PagesService } from "./modules/pages/pages.service";
import { CommentsService } from "./modules/comments/comments.service";
import { FriendsService } from "./modules/friends/friends.service";
import { CategoriesService } from "./modules/categories/categories.service";
import { GHttp } from "helper/helper.http.service";
import { ConfigsService } from "./modules/configs/configs.service"
@Injectable()
export class AppService {
  constructor(
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
    @Inject(forwardRef(() => PagesService))
    private readonly pageService: PagesService,
    @Inject(forwardRef(() => CommentsService))
    private readonly commentsService: CommentsService,
    @Inject(forwardRef(() => FriendsService))
    private readonly friendsService: FriendsService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
    private readonly http: GHttp,
    private readonly configService: ConfigsService,
  ) { }

  async getStat(): Promise<any> {
    return {
      posts: await this.postsService.getNum(), // 文章数
      pages: await this.pageService.getNum(), // 页面数
      comments: await this.commentsService.getNum(), // 评论数
      unReadComments: await this.commentsService.getNum(0), // 未审核评论数
      Allfriends: await this.friendsService.getNum(), // 好友数
      Unfriends: await this.friendsService.getNum(0), // 未审核好友数
      categories: await this.categoriesService.getNum(), // 分类数
    }
  }

  async thumbUp(type: string, path?: string) {
    if (type === 'post') {
      await this.postsService.thumbUp(path)
    } else if (type === 'page') {
      await this.pageService.thumbUp(path)
    } else {
      await this.configService.change({
        name: "theme.thumbs", 
        value: JSON.stringify(Number(JSON.parse(await this.configService.get("theme.thumbs")) + 1))
      })
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
