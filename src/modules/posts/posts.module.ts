import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoryModule } from "modules/category/category.module";
import { CategoryService } from "modules/category/category.service";
import { PostsController } from "./posts.controller";
import { Posts } from "../../shared/entities/posts.entity";
import { PostsService } from "./posts.service";

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), CategoryModule],
  providers: [PostsService, CategoryService],
  controllers: [PostsController],
  exports: [TypeOrmModule],
})
export class PostsModule {}
