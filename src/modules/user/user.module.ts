import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { CategoryModule } from "../category/category.module";
import { PageModule } from "../page/page.module";
import { PostModule } from "../post/post.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    AuthModule,
    forwardRef(() => PostModule),
    forwardRef(() => PageModule),
    forwardRef(() => CategoryModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
