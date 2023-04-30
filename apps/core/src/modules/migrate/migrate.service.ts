import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import {
  MigrateCategory,
  MigrateComment,
  MigrateData,
  MigrateFriend,
  MigratePage,
  MigratePost,
  MigrateUser,
} from './migrate.interface';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import {
  CategoryEvents,
  CommentsEvents,
  FriendsEvents,
  PageEvents,
  PostEvents,
  UserEvents,
} from '~/shared/constants/event.constant';
import { CategoryModel } from '~/apps/page-service/src/model/category.model';
import { CommentsModel } from '~/apps/comments-service/src/comments.model';
import { PostModel } from '~/apps/page-service/src/model/post.model';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class MigrateService {
  constructor(
    @Inject(ServicesEnum.page) private readonly pageService: ClientProxy,
    @Inject(ServicesEnum.user) private readonly userService: ClientProxy,
    @Inject(ServicesEnum.friends) private readonly friendsService: ClientProxy,
    @Inject(ServicesEnum.comments)
    private readonly commentsService: ClientProxy,
  ) {}

  async importUser(data: MigrateUser) {
    const exist = await transportReqToMicroservice(
      this.userService,
      UserEvents.UserGetMaster,
      {},
    ).catch((e) => {
      if (e?.status == 404) {
        return false;
      }
    });
    // if not exist, register
    if (!exist) {
      return await transportReqToMicroservice(
        this.userService,
        UserEvents.UserRegister,
        data,
      );
    } else {
      await transportReqToMicroservice(
        this.userService,
        UserEvents.UserPatch,
        data,
      );
      return await transportReqToMicroservice(
        this.userService,
        UserEvents.UserGetMaster,
        {},
      );
    }
  }

  async importFriends(data: MigrateFriend[]) {
    for (const friend of data) {
      await transportReqToMicroservice(
        this.friendsService,
        FriendsEvents.FriendCreate,
        {
          data: friend,
          isMaster: true, // prevent status change
        },
      );
    }
    return await transportReqToMicroservice(
      this.friendsService,
      FriendsEvents.FriendsGetAllByMaster,
      {
        all: true,
      },
    );
  }

  async importPages(data: MigratePage[]) {
    for (const page of data) {
      await transportReqToMicroservice(
        this.pageService,
        PageEvents.PageCreate,
        page,
      ).catch(() => {
        Logger.warn(`${page.title} 无法导入`, MigrateService.name);
        return null;
      });
    }
    return await transportReqToMicroservice(
      this.pageService,
      PageEvents.PagesGetAll,
      {},
    );
  }
  async importCategories(data: MigrateCategory[]) {
    for (const category of data) {
      const exist = await transportReqToMicroservice<CategoryModel[]>(
        this.pageService,
        CategoryEvents.CategoryGet,
        {
          _query: category.slug,
        },
      ).catch(() => {
        return false;
      });
      if (exist) {
        continue;
      }
      await transportReqToMicroservice<CategoryModel>(
        this.pageService,
        CategoryEvents.CategoryCreate,
        category,
      );
    }
    return await transportReqToMicroservice<CategoryModel[]>(
      this.pageService,
      CategoryEvents.CategoryGetAll,
      {},
    );
  }

  async importPosts(data: MigratePost[], categoriesData: CategoryModel[]) {
    for (const post of data) {
      // transform category slug to id
      const category = isValidObjectId(post.category_id)
        ? categoriesData.find((c) => c.id == post.category_id)
        : categoriesData.find((c) => c.slug == post.category_id);
      let categoryId = category?.id;

      if (!categoryId) {
        // if not exist, create
        const create = await transportReqToMicroservice<CategoryModel>(
          this.pageService,
          CategoryEvents.CategoryCreate,
          {
            name: post.category_id,
            slug: post.category_id,
          },
        );
        categoryId = create.id;
      }
      await transportReqToMicroservice(
        this.pageService,
        PostEvents.PostCreate,
        {
          ...post,
          categoryId,
          category: undefined,
        },
      ).catch((e) => {
        Logger.warn(`${post.title} 无法导入`, MigrateService.name);
        return null;
      });
    }
    return await transportReqToMicroservice(
      this.pageService,
      PostEvents.PostsListGetAll,
      {},
    );
  }

  async importComments(data: MigrateComment[]) {
    // 1. Transform pid to post ObjectId,
    // if post not exist, skip, but put it into an array, finally return error report
    // 2. Sort comments, import parent comments first, then import children comments (Mog will auto bind parent comment)
    const postMap = new Map<string, string>();
    const postError = new Map<string, string>();
    const parentMap = new Map<string, string>();
    const parentError = new Map<string, string>();

    // 1. Transform pid to post ObjectId
    const posts = await transportReqToMicroservice(
      this.pageService,
      PostEvents.PostsListGetAll,
      {},
    );

    for (const post of posts) {
      postMap.set(post.slug, post.id);
    }
    const _comments = data.map((comment) => {
      const postId = postMap.get(comment.pid);
      if (!postId) {
        postError.set(comment.pid, comment.pid);
        return null;
      }
      return {
        ...comment,
        pid: postId,
      };
    });

    const comments = _comments.filter((comment) => comment) as MigrateComment[]; // filter null
    async function sortAndImportComments(
      comments: MigrateComment[],
      commentsService: ClientProxy,
    ) {
      const parentOriginMap = new Map<string, string>();
      const parentComments = comments.filter(
        (comment) => comment.children.length > 0,
      );
      const childrenComments = comments.filter(
        (comment) => comment.children.length == 0,
      );

      for (const comment of parentComments) {
        const create = await transportReqToMicroservice(
          commentsService,
          CommentsEvents.CommentCreate,
          {
            data: {
              ...comment,
              id: undefined, // 重置 id，让 mog 自动生成
            },
            importPattern: true,
          },
        );
        parentOriginMap.set(comment.id!, create.id!); // old parent comment id => new comment id
      }

      // 2.1 Import children comments
      for (const comment of childrenComments) {
        const parentId = parentOriginMap.get(comment.parent);
        await transportReqToMicroservice(
          commentsService,
          CommentsEvents.CommentCreate,
          {
            data: {
              ...comment,
              id: undefined, // reset id, let mog auto generate
              parent: parentId,
            },
            importPattern: true,
          },
        );
        // Recursively sort and import child comments
        if (comment.children) {
          // the type of comment between MigrationComment and CommentsModel is different
          await sortAndImportComments(comment.children as any, commentsService);
        }
      }
    }

    // 2. Sort comments, and import
    await sortAndImportComments(comments, this.commentsService);

    // 3. Return error report
    return {
      postError: Array.from(postError.values()),
      parentError: Array.from(parentError.values()),
    };
  }

  async import(data: MigrateData) {
    const { user, friends, pages, categories, posts, comments } = data;
    const categoriesData = await this.importCategories(categories).catch(
      (e) => {
        Logger.error(`导入分类时出错 ${e}`, MigrateService.name);
        return [];
      },
    );
    const postsData = await this.importPosts(posts, categoriesData).catch(
      (e) => {
        Logger.error(`导入文章时出错 ${e}`, MigrateService.name);
        return [];
      },
    );
    const commentsData = await this.importComments(comments).catch((e) => {
      Logger.error(`导入评论时出错 ${e}`, MigrateService.name);
      return [];
    });
    return {
      user: await this.importUser(user).catch((e) => {
        Logger.error(`导入用户时出错 ${e}`, MigrateService.name);
        return null;
      }),
      friends: await this.importFriends(friends).catch((e) => {
        Logger.error(`导入好友时出错 ${e}`, MigrateService.name);
        return [];
      }),
      pages: await this.importPages(pages).catch((e) => {
        Logger.error(`导入页面时出错 ${e}`, MigrateService.name);
        return [];
      }),
      categories: categoriesData,
      posts: postsData,
      comments: commentsData,
    };
  }

  async exportUser() {
    return await transportReqToMicroservice(
      this.userService,
      UserEvents.UserGetMaster,
      {},
    );
  }

  async exportFriends() {
    return await transportReqToMicroservice(
      this.friendsService,
      FriendsEvents.FriendsGetAllByMaster,
      {
        all: true,
      },
    );
  }

  async exportPages() {
    return await transportReqToMicroservice(
      this.pageService,
      PageEvents.PagesGetAll,
      {},
    );
  }

  async exportCategories() {
    return await transportReqToMicroservice<CategoryModel[]>(
      this.pageService,
      CategoryEvents.CategoryGetAll,
      {},
    );
  }

  async exportPosts() {
    const posts = await transportReqToMicroservice<PostModel[]>(
      this.pageService,
      PostEvents.PostsListGetAll,
      {},
    );

    // 把 category 和 categoryId 都转成 slug
    const categories = await transportReqToMicroservice<CategoryModel[]>(
      this.pageService,
      CategoryEvents.CategoryGetAll,
      {},
    );
    const categoriesMap = new Map<string, string>();
    for (const category of categories) {
      categoriesMap.set(category.id!, category.slug);
    }
    const data = posts.map((post) => {
      const category = post.category;
      (post.category = categoriesMap.get(category?.id) as any),
        // @ts-ignore
        (post.category_id = categoriesMap.get(post.categoryId as any) as any);
      return post;
    });
    return data;
  }

  async exportComments() {
    const req = await transportReqToMicroservice<CommentsModel[]>(
      this.commentsService,
      CommentsEvents.CommentsGetAll,
      {},
    );

    const posts = await transportReqToMicroservice<PostModel[]>(
      this.pageService,
      PostEvents.PostsListGetAll,
      {},
    );

    const postsMap = new Map<string, string>();
    for (const post of posts) {
      postsMap.set(post.id!, post.slug!);
    }

    const data = req.map((comment) => {
      const parent = comment.parent;
      const children = comment.children;
      return {
        ...comment,
        parent: parent || null,
        children: children?.map((child) => child.id),
        pid: postsMap.get(comment.pid),
      };
    });
    return data;
  }

  async export() {
    const user = await this.exportUser();
    const friends = await this.exportFriends();
    const pages = await this.exportPages();
    const categories = await this.exportCategories();
    const posts = await this.exportPosts();
    const comments = await this.exportComments();
    return {
      user,
      friends,
      pages,
      categories,
      posts,
      comments,
    };
  }
}
