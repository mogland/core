import { Module } from '@nestjs/common';
import { FriendsServiceController } from './friends-service.controller';
import { FriendsService } from './friends-service.service';

@Module({
  imports: [],
  controllers: [FriendsServiceController],
  providers: [FriendsService],
})
export class FriendsServiceModule {}
