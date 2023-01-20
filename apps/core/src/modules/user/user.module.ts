/*
 * @FilePath: /mog-core/apps/core/src/modules/user/user.module.ts
 * @author: Wibus
 * @Date: 2022-09-03 22:26:35
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-18 11:43:33
 * Coding With IU
 */

import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthModule } from '~/libs/auth/src';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { UserController } from './user.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.user,
        ...REDIS_TRANSPORTER,
      },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [],
})
export class UserModule {}
