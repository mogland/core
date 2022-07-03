import { Module } from '@nestjs/common';
import { PageService } from './page.service';
import { PageController } from './page.controller';

@Module({
  providers: [PageService],
  controllers: [PageController],
  exports: [PageService],
})
export class PageModule {}
