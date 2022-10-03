/*
 * @FilePath: /mog-core/apps/core/src/modules/comments/comments.client.service.ts
 * @author: Wibus
 * @Date: 2022-10-03 21:54:09
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-03 21:59:30
 * Coding With IU
 */
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';

@Injectable()
export class CommentsClientService {
  constructor(
    @Inject(ServicesEnum.category) private readonly category: ClientProxy,
  ) {}

  async getAllComments() {}
}
