import configs from 'src/configs';
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
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';
import { AppController } from './app.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from './auth/local.strategy';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';
import { PagesService } from './pages/pages.service';
import { PagesModule } from './pages/pages.module';
import { CommentModule } from './comment/comment.module';
import { CommentService } from './comment/comment.service';
import { CategoryService } from './category/category.service';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';

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
    AuthModule,
    PostsModule,
    PagesModule,
    CommentModule,
    CategoryModule,
  ],
  controllers: [AppController, HostController, PagesController, PostsController, CommentController, FriendsController, CommentController, CategoryController],
  providers: [AppService, HostService, FriendsService, UsersService, AuthService, LocalStrategy, JwtStrategy, PostsService, PagesService, CommentService, CategoryService],
})
export class AppModule {}
