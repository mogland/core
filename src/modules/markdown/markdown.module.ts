import { Module } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { MarkdownController } from './markdown.controller';
import { PostsModule } from '../../modules/posts/posts.module';
import { PagesModule } from '../../modules/pages/pages.module';
import { PagesService } from '../../modules/pages/pages.service';
import { PostsService } from '../../modules/posts/posts.service';
import { CategoriesModule } from '../../modules/categories/categories.module';
import { CategoriesService } from '../../modules/categories/categories.service';
import { CommentsService } from '../../modules/comments/comments.service';
import { CommentsModule } from '../../modules/comments/comments.module';
import { UsersModule } from '../../modules/users/users.module';
import { EngineController } from '../engine/engine.controller';
import { EngineModule } from '../engine/engine.module';
import { ConfigsService } from '../configs/configs.service';
import { FriendsService } from '../friends/friends.service';
import { UsersService } from '../users/users.service';
import { GHttp } from '~/helper/helper.http.service';
import { ProjectsService } from '../projects/projects.service';
import { ConfigsModule } from '../configs/configs.module';
import { FriendsModule } from '../friends/friends.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    MarkdownModule,
    EngineModule,
    UsersModule,
    PostsModule,
    PagesModule,
    CommentsModule,
    CategoriesModule,
    FriendsModule,
    ProjectsModule,
    ConfigsModule,

    // Users,
    // Categories,
    // Configs,
    // Friends,
    // Pages,
    // Posts,
    // Projects,
    // Comments
  ],
  providers: [
    MarkdownService,
    EngineController,
    UsersService,
    PostsService,
    PagesService,
    CommentsService,
    CategoriesService,
    FriendsService,
    ProjectsService,
    ConfigsService,
    GHttp,
  ],
  controllers: [MarkdownController]
})
export class MarkdownModule {}
