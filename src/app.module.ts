import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsModule } from 'friends/friends.module';
import { MailController } from 'mail/mail.controller';
import { MailService } from 'mail/mail.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { CategoryService } from './category/category.service';
import { CommentController } from './comment/comment.controller';
import { CommentModule } from './comment/comment.module';
import { CommentService } from './comment/comment.service';
import configs from './configs';
import { FriendsController } from './friends/friends.controller';
import { FriendsService } from './friends/friends.service';
import { HostController } from './host/host.controller';
import { HostModule } from './host/host.module';
import { HostService } from './host/host.service';
import { MailModule } from './mail/mail.module';
import { PagesController } from './pages/pages.controller';
import { PagesModule } from './pages/pages.module';
import { PagesService } from './pages/pages.service';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { PostsService } from './posts/posts.service';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: configs.expiration + 's' },
    }),
    TypeOrmModule.forRoot(),
    HostModule,
    UsersModule,
    FriendsModule,
    AuthModule,
    PostsModule,
    PagesModule,
    CommentModule,
    CategoryModule,
    MailModule,
  ],
  controllers: [AppController, HostController, PagesController, PostsController, CommentController, FriendsController, CommentController, CategoryController, MailController],
  providers: [AppService, HostService, FriendsService, UsersService, AuthService, LocalStrategy, JwtStrategy, PostsService, PagesService, CommentService, CategoryService, MailService],
})
export class AppModule {}
