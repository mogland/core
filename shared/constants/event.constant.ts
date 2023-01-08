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

export enum CommentsEvents {
  CommentsGetList = 'comments.get.list',
  CommentsGetWithPostId = 'comments.get.with.postid',
  CommentsDeleteWithPostId = 'comments.delete.with.postid',

  CommentCreate = 'comment.create',
  // CommentCreateByMaster = 'comment.create.auth',
  CommentPatchByMaster = 'comment.patch.auth',
  CommentUpdateStatusByMaster = 'comment.update.status.auth',
  CommentDeleteByMaster = 'comment.delete.auth',
  CommentReply = 'comment.reply',
  // CommentGet = 'comment.get',

  CommentAddRecaction = 'comment.add.reaction',
  CommentRemoveRecaction = 'comment.remove.reaction',
}

export enum FriendsEvents {
  FriendsGetList = 'friends.get.list',
  FriendsGetAllByMaster = 'friends.get.all.auth',
  FriendsCheckAlive = 'friends.check.alive',
  FriendsAnalyseFeed = 'friends.analyse.feed',

  FriendCreate = 'friend.create',
  FriendGet = 'friend.get',

  FriendUpdateByMasterOrToken = 'friend.put.auth.token',

  FriendDeleteByMasterOrToken = 'friend.delete.auth.token',

  FriendAnalyseAutoCheck = 'friend.analyse.autoCheck',
}
