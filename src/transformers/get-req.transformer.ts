import { ExecutionContext } from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { UserModel } from "~/modules/user/user.model";
export function getNestExecutionContextRequest(
  context: ExecutionContext
): FastifyRequest & { user?: UserModel } & Record<string, any> {
  return context.switchToHttp().getRequest<FastifyRequest>();
}
