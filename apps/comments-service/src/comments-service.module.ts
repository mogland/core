import { Module } from '@nestjs/common';
import { AuthModule } from '~/libs/auth/src';
import { DatabaseModule } from '~/libs/database/src';
import { CommentsServiceController } from './comments-service.controller';
import { CommentsService } from './comments-service.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CommentsServiceController],
  providers: [CommentsService],
})
export class CommentsServiceModule {}
