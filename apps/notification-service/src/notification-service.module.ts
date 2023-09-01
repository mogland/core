import { Module } from '@nestjs/common';
import { HelperModule } from '~/libs/helper/src';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationService } from './notification-service.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationScheduleService } from './notification-schedule.service';
import { ClientsModule } from '@nestjs/microservices';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { NotificationScheduleServiceController } from './notification-schedule.controller';
import { ServicesEnum } from '~/shared/constants/services.constant';

@Module({
  imports: [
    HelperModule,
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'NOTIFICATION_SCHEDULE_SERVICE',
        ...REDIS_TRANSPORTER,
      },
      {
        name: ServicesEnum.config,
        ...REDIS_TRANSPORTER,
      }
    ]),
  ],
  controllers: [
    NotificationServiceController,
    NotificationScheduleServiceController,
  ],
  providers: [NotificationService, NotificationScheduleService],
})
export class NotificationServiceModule {}
