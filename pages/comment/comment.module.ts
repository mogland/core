import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';

@Module({
  providers: [CommentService]
})
export class CommentModule {}
