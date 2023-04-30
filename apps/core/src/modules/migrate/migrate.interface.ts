import { PostModel } from '~/apps/page-service/src/model/post.model';
import { PageModel } from '~/apps/page-service/src/model/page.model';
import { FriendsModel } from '~/apps/friends-service/src/friends.model';

export type MigratePost = Omit<PostModel, 'id' | 'categoryId' | 'category' | 'images'>

export type MigratePage = Omit<PageModel, 'id' | 'images'>

export interface MigrateUser {
  username: string;
  nickname: string;
  description: string;
  avatar: string;
  email: string;
  url: string;
}

export type MigrateFriend = Omit<FriendsModel, 'id' | 'token' | 'autoCheck' | 'feedContents'>

export interface MigrateComment {
  postSlug: string;
  id: string;
  parent: string;
  children: string[];
  author: string;
  email: string;
  url: string;
  text: string;
  status: string;
}

export interface MigrateCategory {
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface MigrateData {
  posts: MigratePost[];
  pages: MigratePage[];
  master: MigrateUser;
  friends: MigrateFriend[];
  comments: MigrateComment[];
  categories: MigrateCategory[];
}