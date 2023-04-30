import { PostModel } from '~/apps/page-service/src/model/post.model';
import { PageModel } from '~/apps/page-service/src/model/page.model';
import { FriendsModel } from '~/apps/friends-service/src/friends.model';
import { CategoryModel } from '~/apps/page-service/src/model/category.model';
import { CommentsModel } from '~/apps/comments-service/src/comments.model';

export type MigratePost = Omit<
  PostModel,
  'id' | 'categoryId' | 'category' | 'images'
> & { category: string };

export type MigratePage = Omit<PageModel, 'id' | 'images'>;

export interface MigrateUser {
  username: string;
  nickname: string;
  description: string;
  avatar: string;
  email: string;
  url: string;
}

export type MigrateFriend = Omit<
  FriendsModel,
  'id' | 'token' | 'autoCheck' | 'feedContents'
>;

export type MigrateComment = Omit<
  CommentsModel,
  'commentsIndex' | 'key' | 'reaction' | 'parent'
>;

export type MigrateCategory = Omit<CategoryModel, 'id' | 'type' | 'created'>;

export interface MigrateData {
  posts: MigratePost[];
  pages: MigratePage[];
  user: MigrateUser;
  friends: MigrateFriend[];
  comments: MigrateComment[];
  categories: MigrateCategory[];
}
