/*
 * @FilePath: /mog-core/apps/core/src/modules/user/user.module.ts
 * @author: Wibus
 * @Date: 2022-09-03 22:26:35
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-01 10:34:42
 * Coding With IU
 */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '~/libs/auth/src';
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';
import { UserController } from './user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.user,
        transport: Transport.TCP,
        options: {
          port: ServicePorts.user,
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
