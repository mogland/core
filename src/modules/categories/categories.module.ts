import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "../../shared/entities/posts.entity";
import { CategoriesController } from "./categories.controller";
import { Categories } from "../../shared/entities/categories.entity";
import { CategoriesService } from "./categories.service";
import { PostsModule } from "../../modules/posts/posts.module";
import { PostsService } from "../../modules/posts/posts.service";
import { CommentsModule } from "../../modules/comments/comments.module";
import { CommentsService } from "../../modules/comments/comments.service";
import { UsersModule } from "../../modules/users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Categories]),
    // TypeOrmModule.forFeature([Posts]),
    // PostsModule,
    CommentsModule,
    UsersModule,
    forwardRef(() => PostsModule)
  ],
  providers: [CategoriesService, PostsService, CommentsService],
  controllers: [CategoriesController],
  exports: [TypeOrmModule],
})
export class CategoriesModule {}
