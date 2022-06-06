import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesModule } from "../categories/categories.module";
import { CategoriesService } from "../categories/categories.service";
import { PostsController } from "./posts.controller";
import { Posts } from "../../shared/entities/posts.entity";
import { PostsService } from "./posts.service";
import { CommentsModule } from "../../modules/comments/comments.module";
import { CommentsService } from "../../modules/comments/comments.service";
import { UsersModule } from "../../modules/users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), 
    forwardRef(() => CategoriesModule),
    CommentsModule,
    UsersModule],
  providers: [PostsService, CategoriesService, CommentsService],
  controllers: [PostsController],
  exports: [TypeOrmModule],
})
export class PostsModule {}
