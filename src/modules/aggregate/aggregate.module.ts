import { forwardRef, Module } from '@nestjs/common';
import { AggregateService } from './aggregate.service';
import { AggregateController } from './aggregate.controller';
import { CategoryModule } from '../category/category.module';
import { CommentModule } from '../comment/comment.module';
import { PageModule } from '../page/page.module';
import { PostModule } from '../post/post.module';

@Module({
  imports: [
    forwardRef(() => CategoryModule),
    forwardRef(() => PostModule),
    forwardRef(() => PageModule),
    forwardRef(() => CommentModule),
  ],
  providers: [AggregateService],
  controllers: [AggregateController],
  exports: [AggregateService],
})
export class AggregateModule {}
