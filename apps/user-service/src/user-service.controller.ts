import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserEvents } from '~/shared/constants/event.constant';
import { UserServiceService } from './user-service.service';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @EventPattern(UserEvents.UserGet)
  handleUserGet() {
    return 'Wibus!';
  }

  @EventPattern(UserEvents.UserCheck)
  handleUserCheckLogged() {}

  @EventPattern(UserEvents.UserRegister)
  handleUserRegister() {}

  @EventPattern(UserEvents.UserPatch)
  handleUserPatch() {}

  @EventPattern(UserEvents.UserLogout)
  handleUserLogout() {}

  @EventPattern(UserEvents.UserLogin)
  handleUserLogin() {}
}
