import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { HelperModule } from '~/libs/helper/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { FriendsServiceController } from './friends-service.controller';
import { FriendsService } from './friends-service.service';
import { DatabaseModule } from '~/libs/database/src';

@Module({
  imports: [
    HelperModule,
    DatabaseModule,
    ClientsModule.register([
      {
        name: ServicesEnum.notification,
        ...REDIS_TRANSPORTER,
      },
      {
        name: ServicesEnum.config,
        ...REDIS_TRANSPORTER,
      }
    ]),
  ],
  controllers: [FriendsServiceController],
  providers: [FriendsService],
})
export class FriendsServiceModule {}
