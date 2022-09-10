/*
 * @FilePath: /nx-core/apps/core/src/modules/user/user.controller.ts
 * @author: Wibus
 * @Date: 2022-09-03 22:26:41
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-10 23:40:49
 * Coding With IU
 */

import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';

@Controller('User')
export class UserController {
  constructor(@Inject(ServicesEnum.user) private readonly user: ClientProxy) {}

  @Get()
  getUser() {
    return this.user.send(UserEvents.UserGet, '');
  }
}
