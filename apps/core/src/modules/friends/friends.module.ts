import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ServicesEnum,
  ServicePorts,
} from '~/shared/constants/services.constant';
import { getEnv } from '~/shared/utils/rag-env';
import { FriendsController } from './friends.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.friends,
        transport: Transport.TCP,
        options: {
          port: getEnv(ServicesEnum.friends)?.port || ServicePorts.friends,
          host: getEnv(ServicesEnum.friends)?.host || undefined,
        },
      },
    ]),
  ],
  controllers: [FriendsController],
  providers: [],
  exports: [],
})
export class FriendsModule {}
