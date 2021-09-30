import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HostController } from './host/host.controller';
import { PagesController } from './pages/pages.controller';
import { PostsController } from './posts/posts.controller';
import { CommentController } from './comment/comment.controller';
import { FriendsController } from './friends/friends.controller';
import { FriendsService } from './core/services/friends.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HostModule } from './core/modules/host.module';
import { HostService } from './core/services/host.service';
import { hostProviders } from './core/providers/host.providers';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), HostModule],
  controllers: [HostController, PagesController, PostsController, CommentController, FriendsController],
  providers: [AppService, FriendsService, HostService, ...hostProviders],
})
export class AppModule {}
