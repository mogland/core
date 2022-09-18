import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { PageServiceController } from './page-service.controller';
import { PageService } from './page-service.service';

@Module({
  imports: [],
  controllers: [PageServiceController],
  providers: [PageService, CategoryService],
  exports: [PageService, CategoryService],
})
export class PageServiceModule {}
