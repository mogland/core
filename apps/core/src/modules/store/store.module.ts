import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { StoreController } from './store.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.store,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [StoreController],
})
export class StoreModule {}
