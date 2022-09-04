/*
 * @FilePath: /nx-core/shared/transformers/get-req.transformer.ts
 * @author: Wibus
 * @Date: 2022-09-04 15:18:09
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-04 15:18:12
 * Coding With IU
 */
import { FastifyRequest } from 'fastify';

import { ExecutionContext } from '@nestjs/common';
import { UserModel } from '~/apps/user-service/src/user.model';

export function getNestExecutionContextRequest(
  context: ExecutionContext,
): FastifyRequest & { user?: UserModel } & Record<string, any> {
  return context.switchToHttp().getRequest<FastifyRequest>();
}
