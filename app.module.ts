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
import { UsersService } from 'users/users.service';
import { AuthService } from 'auth/auth.service';
import { AppController } from './app.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { JwtStrategy } from './auth/jwt.strategy';
import { LocalStrategy } from 'auth/local.strategy';
import { PostsService } from './posts/posts.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '300s' },
    }),

    TypeOrmModule.forRoot(),
    HostModule,
    UsersModule,
    AuthModule,
    PostsModule,
    
  ],
  controllers: [AppController, HostController, PagesController, PostsController, CommentController, FriendsController],
  providers: [AppService, HostService, FriendsService, UsersService, AuthService, LocalStrategy, JwtStrategy, PostsService],
})
export class AppModule {}
