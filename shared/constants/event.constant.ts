/*
 * @FilePath: /mog-core/shared/constants/event.constant.ts
 * @author: Wibus
 * @Date: 2022-09-03 22:18:46
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-03 21:53:01
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
  UserGetMaster = 'user.get.master',
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
  CategoryGet = 'category.get',
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

export enum CommentEvents {
  CommentsGetAll = 'comments.get.all',
  CommentsGetAllByMaster = 'comments.get.all.auth',
  CommentsGetById = 'comments.get.by.id',
  CommentsGetByIdWithMaster = 'comments.get.by.id.auth',
  CommentCreate = 'comment.create',
  CommentCreateByMaster = 'comment.create.auth',
  CommentPatch = 'comment.patch',
  CommentDelete = 'comment.delete',
  CommentReply = 'comment.reply',
  CommentAddRecaction = 'comment.add.reaction',
  CommentRemoveRecaction = 'comment.remove.reaction',
  CommentRecactionGetList = 'comment.reaction.get.list',
}
