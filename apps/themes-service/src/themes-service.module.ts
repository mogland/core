import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '~/libs/config/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { ThemesServiceController } from './themes-service.controller';
import { ThemesServiceService } from './themes-service.service';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: ServicesEnum.notification,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [ThemesServiceController],
  providers: [ThemesServiceService],
})
export class ThemesServiceModule {}
