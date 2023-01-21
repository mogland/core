import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '~/libs/config/src';
import { HelperModule } from '~/libs/helper/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { FriendsServiceController } from './friends-service.controller';
import { FriendsService } from './friends-service.service';

@Module({
  imports: [
    HelperModule,
    ConfigModule,
    ClientsModule.register([
      {
        name: ServicesEnum.notification,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [FriendsServiceController],
  providers: [FriendsService],
})
export class FriendsServiceModule {}
