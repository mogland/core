import { Module, forwardRef } from '@nestjs/common';
import { AggregateModule } from '../aggregate/aggregate.module';
import { CategoryModule } from '../category/category.module';
import { CommentModule } from '../comments/comments.module';
import { LinksModule } from '../links/links.module';
import { PageModule } from '../page/page.module';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { ThemeController } from './theme.controller';
import { ThemeService } from './theme.service';

@Module({
  imports: [
    forwardRef(() => PostModule),
    forwardRef(() => PageModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => CommentModule),
    forwardRef(() => LinksModule),
    forwardRef(() => UserModule),
    forwardRef(() => AggregateModule),
  ],
  controllers: [ThemeController],
  providers: [ThemeService]
})
export class ThemeModule {}
