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
  Ping = 'user.ping',
}

export enum PostEvents {
  PostsListGet = 'posts.get.list',
  PostsListGetAll = 'sudo.posts.get.all',
  PostGet = 'post.get',
  PostGetByMaster = 'post.get.auth',
  PostCreate = 'post.create',
  PostPatch = 'post.patch',
  PostDelete = 'post.delete',
  PostThumbUp = 'post.thumbup',
  Ping = 'post.ping',
}

export enum CategoryEvents {
  CategoryGet = 'category.get',
  CategoryGetAll = 'category.get.all',
  CategoryCreate = 'category.create',
  CategoryPatch = 'category.patch',
  CategoryDelete = 'category.delete',
  CategoryMerge = 'category.merge',
  Ping = 'category.ping',
}

export enum PageEvents {
  PageGet = 'page.get.slug',
  PageGetAll = 'page.get.all',
  PagesGetAll = 'sudo.pages.get.all',
  PageGetByIdWithMaster = 'page.get.byid.auth',
  PageCreate = 'page.create',
  PagePatch = 'page.patch',
  PageDelete = 'page.delete',
  Ping = 'page.ping',
}

export enum CommentsEvents {
  CommentsGetAll = 'sudo.comments.get.all',
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
  Ping = 'comments.ping',
}

export enum FriendsEvents {
  FriendsGetAll = 'sudo.friends.get.all',
  FriendsGetList = 'friends.get.list',
  FriendsGetAllByMaster = 'friends.get.all.auth',
  FriendsCheckAlive = 'friends.check.alive',
  FriendsAnalyseFeed = 'friends.analyse.feed',

  FriendCreate = 'friend.create',
  FriendGet = 'friend.get',

  FriendUpdateByMasterOrToken = 'friend.put.auth.token',
  FriendDeleteByMasterOrToken = 'friend.delete.auth.token',

  FriendPatchStatusByMaster = 'friend.patch.status.auth',
  FriendAnalyseAutoCheck = 'friend.analyse.autoCheck',

  FriendsGetFeeds = 'friends.get.feeds',
  Ping = 'friends.ping',
}

export enum NotificationEvents {
  SystemCatchError = 'system.catch.error',
  SystemUserLogin = 'system.user.login',

  SystemCommentCreate = 'system.comment.create',
  SystemCommentReply = 'system.comment.reply',

  SystemFriendCreate = 'system.friend.create',
  SystemFriendPatchStatus = 'system.friend.patch.status',
  SystemFriendUpdateByToken = 'system.friend.update.token',
  SystemFriendDeleteByMasterOrToken = 'system.friend.delete.auth.token',

  SystemPostCreate = 'system.post.create',
  SystemPostUpdate = 'system.post.update',
  SystemPageCreate = 'system.page.create',
  SystemPageUpdate = 'system.page.update',

  Ping = 'notification.ping',
}
