import { Module } from '@nestjs/common';
import { ConfigModule } from '~/libs/config/src';
import { ThemesServiceController } from './themes-service.controller';
import { ThemesServiceService } from './themes-service.service';

@Module({
  imports: [ConfigModule],
  controllers: [ThemesServiceController],
  providers: [ThemesServiceService],
})
export class ThemesServiceModule {}
