import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IpRecord } from '~/shared/common/decorator/ip.decorator';
import { UserEvents } from '~/shared/constants/event.constant';
import { UserService } from './user-service.service';
import { LoginDto, UserDto } from './user.dto';
import { UserModel } from './user.model';

@Controller()
export class UserServiceController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: UserEvents.Ping })
  ping() {
    return 'pong';
  }

  @MessagePattern({ cmd: UserEvents.UserGet })
  handleUserGet(data: { username: string; getLoginIp: boolean }) {
    return this.userService.getUserByUsername(data.username, data.getLoginIp);
  }

  @MessagePattern({ cmd: UserEvents.UserGetMaster })
  handleUserGetMaster() {
    return this.userService.getMaster();
  }

  // @EventPattern(UserEvents.UserCheck)
  // handleUserCheckLogged() {}

  @MessagePattern({ cmd: UserEvents.UserRegister })
  async handleUserRegister(user: UserDto) {
    user.nickname = user.nickname ?? user.username;
    return await this.userService.register(user as UserModel);
  }

  @MessagePattern({ cmd: UserEvents.UserPatch })
  async handleUserPatch(data: Partial<UserModel>) {
    return await this.userService.patchUserData(data);
  }

  @MessagePattern({ cmd: UserEvents.UserLogin })
  async handleUserLogin(input: { dto: LoginDto; ipLocation: IpRecord }) {
    return await this.userService.login(input.dto, input.ipLocation);
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
