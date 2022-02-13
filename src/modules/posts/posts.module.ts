import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesModule } from "../categories/categories.module";
import { CategoriesService } from "../categories/categories.service";
import { PostsController } from "./posts.controller";
import { Posts } from "../../shared/entities/posts.entity";
import { PostsService } from "./posts.service";

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), CategoriesModule],
  providers: [PostsService, CategoriesService],
  controllers: [PostsController],
  exports: [TypeOrmModule],
})
export class PostsModule {}
