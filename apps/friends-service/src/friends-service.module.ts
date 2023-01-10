import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS } from '~/apps/core/src/app.config';
import { ConfigModule } from '~/libs/config/src';
import { HelperModule } from '~/libs/helper/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { FriendsServiceController } from './friends-service.controller';
import { FriendsService } from './friends-service.service';

@Module({
  imports: [
    HelperModule,
    ConfigModule,
    ClientsModule.register([
      {
        name: ServicesEnum.notification,
        transport: Transport.REDIS,
        options: {
          port: REDIS.port,
          host: REDIS.host,
          password: REDIS.password,
          username: REDIS.user,
        },
      },
    ]),
  ],
  controllers: [FriendsServiceController],
  providers: [FriendsService],
})
export class FriendsServiceModule {}
