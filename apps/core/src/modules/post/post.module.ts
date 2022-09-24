/*
 * @FilePath: /nx-core/apps/core/src/modules/post/post.module.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:41:22
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 15:43:12
 * Coding With IU
 */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { PostController } from './post.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.post,
        transport: Transport.TCP,
      },
    ]),
  ],
  controllers: [PostController],
})
export class PostModule {}
