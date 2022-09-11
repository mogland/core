import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IpRecord } from '~/shared/common/decorator/ip.decorator';
import { UserEvents } from '~/shared/constants/event.constant';
import { UserService } from './user-service.service';
import { LoginDto, UserDto, UserPatchDto } from './user.dto';
import { UserDocument, UserModel } from './user.model';

@Controller()
export class UserServiceController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: UserEvents.UserGet })
  handleUserGet(data: { username: string; getLoginIp: boolean }) {
    return this.userService.getUserByUsername(data.username, data.getLoginIp);
  }

  // @EventPattern(UserEvents.UserCheck)
  // handleUserCheckLogged() {}

  @MessagePattern({ cmd: UserEvents.UserRegister })
  handleUserRegister(user: UserDto) {
    user.nickname = user.nickname ?? user.username;
    return this.userService.register(user as UserModel);
  }

  @MessagePattern({ cmd: UserEvents.UserPatch })
  handleUserPatch(input: { user: UserDocument; data: UserPatchDto }) {
    return this.userService.patchUserData(input.user, input.data);
  }

  @MessagePattern({ cmd: UserEvents.UserLogin })
  async handleUserLogin(input: { dto: LoginDto; ipLocation: IpRecord }) {
    return this.userService.login(input.dto, input.ipLocation);
  }

  @MessagePattern({ cmd: UserEvents.UserLogout })
  handleUserLogout(token: string) {
    return this.userService.signout(token);
  }

  @MessagePattern({ cmd: UserEvents.UserLogoutAll })
  handleUserLogoutAll() {
    return this.userService.signoutAll();
  }

  @MessagePattern({ cmd: UserEvents.UserGetAllSession })
  handleUserGetAllSession(token: string) {
    return this.userService.getAllSignSession(token);
  }
}
