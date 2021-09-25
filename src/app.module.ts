import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { HostController } from './host/host.controller';
import { PagesController } from './pages/pages.controller';
import { PostsController } from './posts/posts.controller';
import { CommentController } from './comment/comment.controller';
import { FriendsController } from './friends/friends.controller';

@Module({
  imports: [],
  controllers: [HostController, PagesController, PostsController, CommentController, FriendsController],
  providers: [AppService],
})
export class AppModule {}
