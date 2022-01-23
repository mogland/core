import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "../../shared/entities/posts.entity";
import { CategoryController } from "./category.controller";
import { Category } from "../../shared/entities/category.entity";
import { CategoryService } from "./category.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Posts]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [TypeOrmModule],
})
export class CategoryModule {}
