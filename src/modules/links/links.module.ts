import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';

@Module({
  providers: [LinksService],
  controllers: [LinksController]
})
export class LinksModule {}
