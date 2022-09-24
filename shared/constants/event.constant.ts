/*
 * @FilePath: /nx-core/shared/constants/event.constant.ts
 * @author: Wibus
 * @Date: 2022-09-03 22:18:46
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 15:37:31
 * Coding With IU
 */

export enum UserEvents {
  UserCreated = 'user.created',
  UserLogin = 'user.login',
  UserLogout = 'user.logout',
  UserLogoutAll = 'user.logout.all',
  UserPatch = 'user.patch',
  UserRegister = 'user.register',
  UserCheck = 'user.check',
  UserGet = 'user.get',
  UserGetAllSession = 'user.get.session.all',
}

export enum PostEvents {
  PostsListGet = 'posts.get.all',
  PostGet = 'post.get',
  PostGetByMaster = 'post.get.auth',
  PostCreate = 'post.create',
  PostPatch = 'post.patch',
  PostDelete = 'post.delete',
  PostThumbUp = 'post.thumbup',
}

export enum CategoryEvents {
  CategoryGetById = 'category.get.id',
  CategoryGetBySlug = 'category.get.slug',
  CategoryGetAll = 'category.get.all',
  CategoryCreate = 'category.create',
  CategoryPatch = 'category.patch',
  CategoryDelete = 'category.delete',
  CategoryMerge = 'category.merge',
}

export enum PageEvents {
  PageGet = 'page.get',
  PageGetAll = 'page.get.all',
  PageGetByIdWithMaster = 'page.get.byid.auth',
  PageCreate = 'page.create',
  PagePatch = 'page.patch',
  PageDelete = 'page.delete',
}
