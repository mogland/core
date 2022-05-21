import { Module } from '@nestjs/common';
import { GHttp } from 'helper/helper.http.service';
import { AuthModule } from 'modules/auth/auth.module';
import { CategoriesModule } from 'modules/categories/categories.module';
import { CategoriesService } from 'modules/categories/categories.service';
import { CommentsModule } from 'modules/comments/comments.module';
import { CommentsService } from 'modules/comments/comments.service';
import { ConfigsModule } from 'modules/configs/configs.module';
import { ConfigsService } from 'modules/configs/configs.service';
import { FriendsModule } from 'modules/friends/friends.module';
import { FriendsService } from 'modules/friends/friends.service';
import { MailModule } from 'modules/mail/mail.module';
import { PagesModule } from 'modules/pages/pages.module';
import { PagesService } from 'modules/pages/pages.service';
import { PostsModule } from 'modules/posts/posts.module';
import { PostsService } from 'modules/posts/posts.service';
import { ProjectsModule } from 'modules/projects/projects.module';
import { ProjectsService } from 'modules/projects/projects.service';
import { UsersModule } from 'modules/users/users.module';
import { UsersService } from 'modules/users/users.service';
import { Categories } from 'shared/entities/categories.entity';
import { Comments } from 'shared/entities/comments.entity';
import { Configs } from 'shared/entities/configs.entity';
import { Friends } from 'shared/entities/friends.entity';
import { Pages } from 'shared/entities/pages.entity';
import { Posts } from 'shared/entities/posts.entity';
import { Projects } from 'shared/entities/projects.entity';
import { Users } from 'shared/entities/users.entity';
import { EngineController } from './engine.controller';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    PagesModule,
    CommentsModule,
    CategoriesModule,
    FriendsModule,
    ProjectsModule,
    ConfigsModule,

    Users,
    Categories,
    Configs,
    Friends,
    Pages,
    Posts,
    Projects,
    Comments
  ],
  controllers: [
    EngineController
  ],
  providers: [
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
})
export class EngineModule { }
