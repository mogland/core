import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserEvents } from '~/shared/constants/event.constant';
import { NotificationService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: UserEvents.UserGetMaster })
  async userGetMaster() {
    console.log('userGetMaster');
  }
}
