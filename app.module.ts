import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostController } from './host/host.controller';
import { PagesController } from './pages/pages.controller';
import { PostsController } from './posts/posts.controller';
import { CommentController } from './comment/comment.controller';
import { FriendsController } from './friends/friends.controller';
import { FriendsService } from './friends/friends.service';
import { HostService } from './host/host.service';
import { HostModule } from './host/host.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    HostModule,
  ],
  controllers: [HostController, PagesController, PostsController, CommentController, FriendsController],
  providers: [AppService, HostService, FriendsService],
})
export class AppModule {}
