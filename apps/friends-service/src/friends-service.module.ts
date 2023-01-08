import { Module } from '@nestjs/common';
import { ConfigModule } from '~/libs/config/src';
import { HelperModule } from '~/libs/helper/src';
import { FriendsServiceController } from './friends-service.controller';
import { FriendsService } from './friends-service.service';

@Module({
  imports: [HelperModule, ConfigModule],
  controllers: [FriendsServiceController],
  providers: [FriendsService],
})
export class FriendsServiceModule {}
