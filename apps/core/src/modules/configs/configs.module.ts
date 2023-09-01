import { Module } from '@nestjs/common';
import { ConfigsController } from './configs.controller';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.config,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [ConfigsController],
})
export class ConfigPublicModule {}
