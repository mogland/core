import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { UserModule } from '../user/user.module';
import { ConfigsModule } from '../configs/configs.module';
import { ToolsModule } from '../tools/tools.module';

@Module({
  imports: [UserModule, ConfigsModule, ToolsModule],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
