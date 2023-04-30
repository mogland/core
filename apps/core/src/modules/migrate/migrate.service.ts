import { Inject, Injectable } from '@nestjs/common';
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
      return await transportReqToMicroservice(
        this.userService,
        UserEvents.UserPatch,
        data,
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
      );
    }
    return await transportReqToMicroservice(
      this.pageService,
      PageEvents.PagesGetAll,
      {},
    );
  }
  async importCategories(data: MigrateCategory[]) {
    for (const category of data) {
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
      const category = categoriesData.find(
        (category) => category.slug === post.category, // find category by slug
      );
      let categoryId = category?.id;
      if (!categoryId) {
        // if not exist, create
        const create = await transportReqToMicroservice<CategoryModel>(
          this.pageService,
          CategoryEvents.CategoryCreate,
          {
            name: post.category,
            slug: post.category,
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
        },
      );
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
    ).then((res) => res.data);

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

    async function sortAndImportComments(comments: MigrateComment[]) {
      const parentComments = comments.filter((comment) => !comment.children);
      const childrenComments = comments.filter((comment) => comment.children);
      for (const comment of parentComments) {
        await transportReqToMicroservice(
          this.commentsService,
          CommentsEvents.CommentCreate,
          {
            ...comment,
            id: undefined, // 重置 id，让 mog 自动生成
          },
        );
      }
  
      // 2.1 Transform pid to parent comment ObjectId
  
      const parentCommentsData = await transportReqToMicroservice(
        this.commentsService,
        CommentsEvents.CommentsGetAll,
        {},
      ).then((res) => res.data);
      for (const comment of parentCommentsData) {
        parentMap.set(comment.pid, comment.id);
      }
  
      // 2.2 Import children comments
      for (const comment of childrenComments) {
        const parentId = parentMap.get(comment.pid);
        if (!parentId) {
          parentError.set(comment.pid, comment.pid);
        }
        await transportReqToMicroservice(
          this.commentsService,
          CommentsEvents.CommentCreate,
          {
            ...comment,
            id: undefined, // reset id, let mog auto generate
            parent: parentId,
          },
        );
        // Recursively sort and import child comments
        await this.sortAndImportComments(comment.children, parentMap, parentError);
      }
    }

    // 2. Sort comments, and import
    await sortAndImportComments(comments);

    // 3. Return error report
    return {
      postError: Array.from(postError.values()),
      parentError: Array.from(parentError.values()),
    };
  }

  async import(data: MigrateData) {
    const {
      user,
      friends,
      pages,
      categories,
      posts,
      comments,
    } = data;
    const categoriesData = await this.importCategories(categories);
    const postsData = await this.importPosts(posts, categoriesData);
    const commentsData = await this.importComments(comments);
    return {
      user: await this.importUser(user),
      friends: await this.importFriends(friends),
      pages: await this.importPages(pages),
      categories: categoriesData,
      posts: postsData,
      comments: commentsData,
    };
  }
}
