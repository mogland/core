import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { Comments } from './comment.entity';
import { CommentService } from './comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comments])],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [TypeOrmModule]
})
export class CommentModule {}
