import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Posts } from "../posts/posts.entity";
import { CategoryController } from "./category.controller";
import { Category } from "./category.entity";
import { CategoryService } from "./category.service";

@Module({
    imports: [TypeOrmModule.forFeature([Category]), TypeOrmModule.forFeature([Posts])],
    providers: [CategoryService],
    controllers: [CategoryController],
    exports: [TypeOrmModule],
})
export class CategoryModule {}
