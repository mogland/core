/*
 * @FilePath: /nx-core/shared/common/decorator/current-user.decorator.ts
 * @author: Wibus
 * @Date: 2022-06-07 22:10:05
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-09 21:36:17
 * Coding With IU
 */
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { getNestExecutionContextRequest } from '../../transformers/get-req.transformer';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getNestExecutionContextRequest(ctx).user;
  },
);
