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
  
  async importComments(data: MigrateComment[]) {}

  async import(data: MigrateData) {}
}
