import { Module } from '@nestjs/common';
import { FriendsBasicService } from './friends.basic.service';
import { FriendsController } from './friends.controller';

@Module({
  imports: [],
  controllers: [FriendsController],
  providers: [FriendsBasicService],
  exports: [FriendsBasicService],
})
export class FriendsModule {}
