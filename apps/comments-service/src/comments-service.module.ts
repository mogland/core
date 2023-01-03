import { Module } from '@nestjs/common';
import { CommentsServiceController } from './comments-service.controller';
import { CommentsServiceService } from './comments-service.service';

@Module({
  imports: [],
  controllers: [CommentsServiceController],
  providers: [CommentsServiceService],
})
export class CommentsServiceModule {}
