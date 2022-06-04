import { Module } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { MarkdownController } from './markdown.controller';
import { PostsModule } from 'modules/posts/posts.module';
import { PagesModule } from 'modules/pages/pages.module';
import { PagesService } from 'modules/pages/pages.service';
import { PostsService } from 'modules/posts/posts.service';
import { CategoriesModule } from 'modules/categories/categories.module';
import { CategoriesService } from 'modules/categories/categories.service';
import { CommentsService } from 'modules/comments/comments.service';
import { CommentsModule } from 'modules/comments/comments.module';
import { UsersModule } from 'modules/users/users.module';

@Module({
  imports: [PostsModule, PagesModule, CategoriesModule, CommentsModule, UsersModule],
  providers: [MarkdownService, PostsService, PagesService, CategoriesService, CommentsService],
  controllers: [MarkdownController]
})
export class MarkdownModule {}
