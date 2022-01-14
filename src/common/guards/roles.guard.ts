/*
 * @FilePath: /GS-server/src/common/guards/roles.guard.ts
 * @author: Wibus
 * @Date: 2022-01-14 20:32:50
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-14 20:35:02
 * Coding With IU
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * 区分游客和主人的守卫
 */

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isMaster = false
    const request = this.getRequest(context)

    if (request.headers['authorization']) {
      try {
        isMaster = (await super.canActivate(context)) as boolean
      } catch {}
    }
    request.isGuest = !isMaster
    request.isMaster = isMaster
    return true
  }

  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp()
    return ctx.getRequest()
  }
}
