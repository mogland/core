/*
 * @FilePath: /nx-core/apps/core/src/modules/post/post.controller.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:52:34
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 15:52:35
 * Coding With IU
 */

import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { ServicesEnum } from '~/shared/constants/services.constant';

@Controller('post')
@ApiName
export class PostController {
  constructor(@Inject(ServicesEnum.post) private readonly post: ClientProxy) {}
}
