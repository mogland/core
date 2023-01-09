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
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS } from '../../app.config';
import { UserController } from './user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.user,
        transport: Transport.REDIS,
        options: {
          port: REDIS.port,
          host: REDIS.host,
          password: REDIS.password,
          username: REDIS.user,
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
