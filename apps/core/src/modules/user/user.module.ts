/*
 * @FilePath: /nx-core/apps/core/src/modules/user/user.module.ts
 * @author: Wibus
 * @Date: 2022-09-03 22:26:35
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-11 08:31:45
 * Coding With IU
 */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '~/libs/auth/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { UserController } from './user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.user,
        transport: Transport.TCP,
      },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
