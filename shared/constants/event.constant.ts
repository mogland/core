/*
 * @FilePath: /nx-core/shared/constants/event.constant.ts
 * @author: Wibus
 * @Date: 2022-09-03 22:18:46
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-17 14:21:00
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

export enum CategoryEvents {
  CategoryCreated = 'category.created',
  CategoryGet = 'category.get',
  CategoryGetAll = 'category.get.all',
  CategoryMerge = 'category.merge',
  CategoryPatch = 'category.patch',
  CategoryDelete = 'category.delete',
}
