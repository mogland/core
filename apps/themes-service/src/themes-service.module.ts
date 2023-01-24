import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '~/libs/config/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { ThemesRenderService } from './themes-render.service';
import { ThemesServiceController } from './themes-service.controller';
import { ThemesServiceService } from '../../../themes-service.service';

const services = {
  [ServicesEnum.page]: ServicesEnum.page,
  [ServicesEnum.user]: ServicesEnum.user,
  [ServicesEnum.friends]: ServicesEnum.friends,
  [ServicesEnum.comments]: ServicesEnum.comments,
  [ServicesEnum.notification]: ServicesEnum.notification,
};

const registers = Object.values(services).map((name) => ({
  name,
  ...REDIS_TRANSPORTER,
}));

@Module({
  imports: [ConfigModule, ClientsModule.register(registers)],
  controllers: [ThemesServiceController],
  providers: [ThemesServiceService, ThemesRenderService],
})
export class ThemesServiceModule {}
