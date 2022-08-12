import { Module } from "@nestjs/common";
import { BackupService } from "./backup.service";
import { BackupController } from "./backup.controller";
import { UserModule } from "../user/user.module";
import { CategoryModule } from "../category/category.module";
import { PostModule } from "../post/post.module";
import { PageModule } from "../page/page.module";
import { CommentModule } from "../comments/comments.module";

@Module({
  imports: [UserModule, CategoryModule, PostModule, PageModule, CommentModule],
  providers: [BackupService],
  controllers: [BackupController],
  exports: [BackupService],
})
export class BackupModule {}
