import { PostModel } from '~/apps/page-service/src/model/post.model';
import { PageModel } from '~/apps/page-service/src/model/page.model';
import { FriendsModel } from '~/apps/friends-service/src/friends.model';
import { CategoryModel } from '~/apps/page-service/src/model/category.model';
import { CommentsModel } from '~/apps/comments-service/src/comments.model';
import { UserModel } from '~/apps/user-service/src/user.model';

export type MigratePost = Omit<
  PostModel,
  'id' | 'category' | 'images'
>;

export type MigratePage = Omit<PageModel, 'id' | 'images'>;

export type MigrateUser = Omit<
  UserModel,
  'password' | 'lastLoginTime' | 'lastLoginIp' | 'apiToken' | 'created' | 'id'
>;

export type MigrateFriend = Omit<
  FriendsModel,
  'id' | 'token' | 'autoCheck' | 'feedContents'
>;

export type MigrateComment = Omit<
  CommentsModel,
  'commentsIndex' | 'key' | 'reaction' | 'parent' | 'children'
> & { parent: string; children: string[] };

export type MigrateCategory = Omit<CategoryModel, 'id' | 'type' | 'created'>;

export interface MigrateData {
  posts: MigratePost[];
  pages: MigratePage[];
  user: MigrateUser;
  friends: MigrateFriend[];
  comments: MigrateComment[];
  categories: MigrateCategory[];
}
