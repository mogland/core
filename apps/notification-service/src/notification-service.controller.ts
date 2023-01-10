import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
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

  @EventPattern(NotificationEvents.SystemUserLogin)
  async userLogin(input: { dto: LoginDto; ipLocation: IpRecord }) {
    console.log('用户尝试登陆', input.dto.username);
    this.notificationService.sendEvent(UserEvents.UserLogin, input);
  }

  @EventPattern(NotificationEvents.SystemCatchError)
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
