import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LoginDto } from '~/apps/user-service/src/user.dto';
import { IpRecord } from '~/shared/common/decorator/ip.decorator';
import {
  NotificationEvents,
  UserEvents,
} from '~/shared/constants/event.constant';
import { NotificationService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) {}

  @MessagePattern({ cmd: UserEvents.UserLogin })
  async userLogin(input: { dto: LoginDto; ipLocation: IpRecord }) {
    this.notificationService.sendEvent(UserEvents.UserLogin, input);
  }

  @MessagePattern(NotificationEvents.SystemCatchError)
  async systemCatchError(input: {
    exception: unknown;
    url: string;
    message: any;
  }) {
    this.notificationService.sendEvent(
      NotificationEvents.SystemCatchError,
      input,
    );
  }
}
