import { forwardRef, Module } from "@nestjs/common";
import { PostModule } from "../post/post.module";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [forwardRef(() => PostModule)],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
