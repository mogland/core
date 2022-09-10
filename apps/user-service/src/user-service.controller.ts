import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from '~/libs/auth/src';
import { IpRecord } from '~/shared/common/decorator/ip.decorator';
import { UserEvents } from '~/shared/constants/event.constant';
import { getAvatar } from '~/shared/utils';
import { UserService } from './user-service.service';
import { LoginDto } from './user.dto';

@Controller()
export class UserServiceController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @EventPattern(UserEvents.UserGet)
  handleUserGet(username: string, getLoginIp: boolean) {
    return this.userService.getUserByUsername(username, getLoginIp);
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
  async handleUserLogin(dto: LoginDto, ipLocation: IpRecord) {
    const user = await this.userService.login(dto.username, dto.password);
    const footstep = await this.userService.recordFootstep(
      dto.username,
      ipLocation.ip,
    );
    const { nickname, username, created, url, email, id } = user;
    const avatar = user.avatar ?? getAvatar(email);
    const token = this.authService.jwtServicePublic.sign(user.id, {
      ip: ipLocation.ip,
      ua: ipLocation.agent,
    });
    return {
      token,
      ...footstep,
      nickname,
      username,
      created,
      url,
      email,
      avatar,
      id,
    };
  }
}
