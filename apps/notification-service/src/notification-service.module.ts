import { Module } from '@nestjs/common';
import { ConfigModule } from '~/libs/config/src';
import { HelperModule } from '~/libs/helper/src';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationService } from './notification-service.service';

@Module({
  imports: [ConfigModule, HelperModule],
  controllers: [NotificationServiceController],
  providers: [NotificationService],
})
export class NotificationServiceModule {}
