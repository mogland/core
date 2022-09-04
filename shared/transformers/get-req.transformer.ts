import { FastifyRequest } from 'fastify';

import { ExecutionContext } from '@nestjs/common';
import { UserModel } from '~/apps/user-service/src/user.model';

export function getNestExecutionContextRequest(
  context: ExecutionContext,
): FastifyRequest & { user?: UserModel } & Record<string, any> {
  return context.switchToHttp().getRequest<FastifyRequest>();
}
