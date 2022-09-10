import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { UserEvents } from '~/shared/constants/event.constant';
import { UserService } from './user-service.service';

@Controller()
export class UserServiceController {
  constructor(private readonly userService: UserService) {}

  @EventPattern(UserEvents.UserGet)
  handleUserGet(username: string) {
    return this.userService.getUserByUsername(username);
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
