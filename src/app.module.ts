import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HostController } from './host/host.controller';
import { PagesController } from './pages/pages.controller';
import { PostsController } from './posts/posts.controller';
import { CommentController } from './comment/comment.controller';
import { FriendsController } from './friends/friends.controller';
import { FriendsService } from './friends/friends.service';

@Module({
  imports: [],
  controllers: [HostController, PagesController, PostsController, CommentController, FriendsController],
  providers: [AppService, FriendsService],
})
export class AppModule {}
