import { Module } from '@nestjs/common';
import { DatabaseModule } from '~/libs/database/src';
import { CategoryService } from './category.service';
import { PageServiceController } from './page-service.controller';
import { PageService } from './page-service.service';
import { PostService } from './post-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [PageServiceController],
  providers: [PostService, CategoryService, PageService],
  exports: [PostService, CategoryService, PageService],
})
export class PageServiceModule {}
