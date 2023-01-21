/*
 * @FilePath: /mog-core/apps/core/src/modules/post/post.module.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:41:22
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-18 11:41:20
 * Coding With IU
 */

import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { PostController } from './post.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.post,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [PostController],
})
export class PostModule {}
