import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { ThemesController } from './themes.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.theme,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [ThemesController],
  providers: [],
})
export class ThemesModule {}
