import { Module } from '@nestjs/common';
import { ThemesServiceController } from './themes-service.controller';
import { ThemesServiceService } from './themes-service.service';

@Module({
  imports: [],
  controllers: [ThemesServiceController],
  providers: [ThemesServiceService],
})
export class ThemesServiceModule {}
