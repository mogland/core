import configs from "./configs";
import configuration from "./utils/getEnvConfig.util";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FriendsModule } from "modules/friends/friends.module";
import { MailController } from "modules/mail/mail.controller";
import { MailService } from "modules/mail/mail.service";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthService } from "./modules/auth/auth.service";
import { jwtConstants } from "./modules/auth/constants";
import { JwtStrategy } from "./modules/auth/jwt.strategy";
import { LocalStrategy } from "./modules/auth/local.strategy";
import { CategoryController } from "./modules/category/category.controller";
import { CategoryModule } from "./modules/category/category.module";
import { CategoryService } from "./modules/category/category.service";
import { CommentController } from "./modules/comment/comment.controller";
import { CommentModule } from "./modules/comment/comment.module";
import { CommentService } from "./modules/comment/comment.service";
import { FriendsController } from "./modules/friends/friends.controller";
import { FriendsService } from "./modules/friends/friends.service";
import { HostController } from "./modules/host/host.controller";
import { HostModule } from "./modules/host/host.module";
import { HostService } from "./modules/host/host.service";
import { MailModule } from "./modules/mail/mail.module";
import { PagesController } from "./modules/pages/pages.controller";
import { PagesModule } from "./modules/pages/pages.module";
import { PagesService } from "./modules/pages/pages.service";
import { PostsController } from "./modules/posts/posts.controller";
import { PostsModule } from "./modules/posts/posts.module";
import { PostsService } from "./modules/posts/posts.service";
import { UsersModule } from "./modules/users/users.module";
import { UsersService } from "./modules/users/users.service";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: configs.expiration + "s" },
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: "mysql",
          host: configService.get("DB_HOST"),
          port: configService.get("DB_PORT"),
          username: configService.get("DB_USERNAME"),
          password: configService.get("DB_PASSWORD"),
          database: configService.get("DB_DATABASE"),
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    HostModule,
    UsersModule,
    AuthModule,
    PostsModule,
    PagesModule,
    CommentModule,
    CategoryModule,
    MailModule,
    FriendsModule,
  ],
  controllers: [
    AppController,
    HostController,
    PagesController,
    PostsController,
    CommentController,
    CategoryController,
    MailController,
    FriendsController,
  ],
  providers: [
    AppService,
    HostService,
    UsersService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PostsService,
    PagesService,
    CommentService,
    CategoryService,
    MailService,
    FriendsService,
  ],
})
export class AppModule {}
