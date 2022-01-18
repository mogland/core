/*
 * @FilePath: /GS-server/src/common/guards/roles.guard.ts
 * @author: Wibus
 * @Date: 2022-01-14 20:32:50
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-17 17:16:35
 * Coding With IU
 */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let isMaster = false
    const request = this.getRequest(context)

    if (request.headers['authorization']) {
      console.log(request.headers['authorization'])
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
/**
 * 如果要让此守卫返回true，则必须在请求中提供一个有效的JWT令牌。
 * 否则将永远返回false。
 */