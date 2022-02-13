import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "../../shared/entities/posts.entity";
import { CategoriesController } from "./categories.controller";
import { Categories } from "../../shared/entities/categories.entity";
import { CategoriesService } from "./categories.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Categories]),
    TypeOrmModule.forFeature([Posts]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [TypeOrmModule],
})
export class CategoriesModule {}
