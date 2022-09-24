/*
 * @FilePath: /nx-core/shared/constants/echo.constant.ts
 * @author: Wibus
 * @Date: 2022-09-12 15:08:56
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 08:39:43
 * Coding With IU
 */

export enum ExceptionMessage {
  UserIsExist = '我已经有一个主人了哦',
  UserNameIsExist = '用户名已存在',
  UserNameError = '用户名错误',
  UserPasswordError = '密码错误',
  UserNotFound = '用户不存在',
  UserPasswordIsSame = '密码可不能和原来的一样哦',

  CategoryIsNotExist = '分类不存在o(╯□╰)o',

  SlugIsExist = '文章路径已经存在了哦',
  PostIsNotExist = '文章不存在o(╯□╰)o',
  PostIsProtected = '文章受保护了哦，需要密码才能查看',
  PostPasswordIsWrong = '文章密码错误了o(╯□╰)o',

  PageIsNotExist = '页面不存在o(╯□╰)o',
  PageIsProtected = '页面受保护了哦，需要密码才能查看',
}
