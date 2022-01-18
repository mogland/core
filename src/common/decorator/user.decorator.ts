/*
 * @FilePath: /GS-server/src/common/decorator/user.decorator.ts
 * @author: Wibus
 * @Date: 2022-01-18 19:53:56
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-18 19:55:52
 * Coding With IU
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { getNestExecutionContextRequest } from '../../utils/nest.util'

export const IsGuest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getNestExecutionContextRequest(ctx)
    return request.isGuest
  },
)

export const IsMaster = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getNestExecutionContextRequest(ctx)
    return request.isMaster
  },
)
