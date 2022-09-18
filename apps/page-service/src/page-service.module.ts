import { Module } from '@nestjs/common';
import { PageServiceController } from './page-service.controller';
import { PageService } from './page-service.service';

@Module({
  imports: [],
  controllers: [PageServiceController],
  providers: [PageService],
})
export class PageServiceModule {}
