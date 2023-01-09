/*
 * @FilePath: /mog-core/apps/core/src/modules/post/post.module.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:41:22
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-18 11:41:20
 * Coding With IU
 */

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';
import { getEnv } from '~/shared/utils/rag-env';
import { REDIS } from '../../app.config';
import { PostController } from './post.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.post,
        transport: Transport.REDIS,
        options: {
          port: REDIS.port,
          host: REDIS.host,
          password: REDIS.password,
          username: REDIS.user,
        },
      },
    ]),
  ],
  controllers: [PostController],
})
export class PostModule { }
