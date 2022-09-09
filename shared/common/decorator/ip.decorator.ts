/*
 * @FilePath: /nx-core/shared/common/decorator/ip.decorator.ts
 * @author: Wibus
 * @Date: 2022-06-07 22:09:07
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-09 21:36:50
 * Coding With IU
 */
import { FastifyRequest } from 'fastify';

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { getIp } from '../../utils/ip.util';

export type IpRecord = {
  ip: string;
  agent: string;
};
export const IpLocation = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    const ip = getIp(request);
    const agent = request.headers['user-agent'];
    return {
      ip,
      agent,
    };
  },
);
