import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { FriendsController } from './friends.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.friends,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [FriendsController],
  providers: [],
  exports: [],
})
export class FriendsModule {}
