import { Module } from '@nestjs/common';
import { DatabaseModule } from '~/libs/database/src';
import { CommentsController } from './comments-service.controller';
import { CommentsService } from './comments-service.service';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsServiceModule {}
