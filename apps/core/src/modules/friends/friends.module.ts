import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';

@Module({
  imports: [],
  controllers: [FriendsController],
  providers: [],
  exports: [],
})
export class FriendsModule {}
