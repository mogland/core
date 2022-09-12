/*
 * @FilePath: /nx-core/shared/common/decorator/request-user.decorator.ts
 * @author: Wibus
 * @Date: 2022-09-11 08:10:38
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-11 08:10:39
 * Coding With IU
 */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { getNestExecutionContextRequest } from '~/shared/transformers/get-req.transformer';

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getNestExecutionContextRequest(ctx).user;
  },
);

export const RequestUserToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getNestExecutionContextRequest(ctx).token;
  },
);
