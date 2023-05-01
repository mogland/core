/*
 * @FilePath: /mog-core/shared/constants/echo.constant.ts
 * @author: Wibus
 * @Date: 2022-09-12 15:08:56
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-04 12:57:32
 * Coding With IU
 */

export enum ExceptionMessage {
  QueryArgIsRequire = 'Query参数必须存在o',

  UserIsExist = '我已经有一个主人了哦',
  UserNameIsExist = '用户名已存在',
  UserNameError = '用户名错误',
  UserPasswordError = '密码错误',
  UserNotFound = '用户不存在',
  UserPasswordIsSame = '密码可不能和原来的一样哦',

  CategoryIsNotExist = '分类不存在 o(╯□╰)o',
  CantFindCategory = '找不到分类 o(╯□╰)o',
  CategoryHasPost = '分类下有文章，不能删除哦',

  SlugIsExist = '文章路径已经存在了哦',
  PostIsNotExist = '文章不存在 o(╯□╰)o',
  PostIsProtected = '文章受保护了哦，需要密码才能查看',
  PostPasswordIsWrong = '文章密码错误了 o(╯□╰)o',

  PageIsNotExist = '页面不存在 o(╯□╰)o',
  PageIsProtected = '页面受保护了哦，需要密码才能查看',

  CommentNotFound = '评论不存在 (｡ì _ í｡)',
  InvalidCommentReaction = '无效的评论反应 (｡ì _ í｡)',

  StatusIsNotRight = '状态不正确啊 (ﾟoﾟ;;',

  FriendLinkIsNotExist = '友链不存在 o(╯□╰)o',
  FriendLinkTokenIsInvalid = '友链Token无效，可能找错了哦',
  FriendLinkIsExist = '友链已存在 o(╯□╰)o',

  ConsoleFileIsNotExist = '@mogland/console 所期望请求的文件不存在，请提交 issues 至 mogland/console',
  CONSOLE_INIT_FAILED = '@mogland/console 文件初始化失败，请提交 issues 至 mogland/console',
  ConsoleInitSuccess = '控制台服务初始化成功',
  ConsoleIsDisabled = '控制台服务已被禁用',
  CONSOLE_REQUEST_FAILED = '控制台资源请求失败！',
  ConsoleRefreshFailed = '控制台资源刷新失败！',
  ConsoleRefreshSuccess = '控制台资源刷新成功！',
}
