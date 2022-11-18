/*
 * @FilePath: /mog-core/apps/core/src/modules/user/user.module.ts
 * @author: Wibus
 * @Date: 2022-09-03 22:26:35
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-18 11:43:33
 * Coding With IU
 */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '~/libs/auth/src';
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';
import { getEnv } from '~/shared/utils/rag-env';
import { UserController } from './user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.user,
        transport: Transport.TCP,
        options: {
          port: getEnv(ServicesEnum.user)?.port || ServicePorts.user,
          host: getEnv(ServicesEnum.user)?.host || undefined,
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
