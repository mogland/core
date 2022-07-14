/*
 * @FilePath: /nx-core/src/common/decorator/role.decorator.ts
 * @author: Wibus
 * @Date: 2022-06-07 22:07:30
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-07 22:07:30
 * Coding With IU
 */
import { ExecutionContext, createParamDecorator } from "@nestjs/common";

import { getNestExecutionContextRequest } from "~/transformers/get-req.transformer";

export const IsGuest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getNestExecutionContextRequest(ctx);
    return request.isGuest;
  }
);

export const IsMaster = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getNestExecutionContextRequest(ctx);
    return request.isMaster;
  }
);
