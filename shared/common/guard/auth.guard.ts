/**
 * @module common/guard/auth.guard
 * @description 令牌验证的守卫
 * @author Innei <https://innei.ren>
 */
import { isJWT } from 'class-validator';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '~/libs/auth/src';

import { getNestExecutionContextRequest } from '~/shared/transformers/get-req.transformer';
import { ConfigService } from '~/libs/config/src';

/**
 * JWT auth guard
 */

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected readonly authService: AuthService,
    protected readonly configs: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = this.getRequest(context);

    const query = request.query as any;
    const headers = request.headers;
    const Authorization: string =
      headers.authorization || headers.Authorization || query.token;

    if (!Authorization) {
      throw new UnauthorizedException('未登录');
    }

    const jwt = Authorization.replace(/[Bb]earer /, '');

    if (!isJWT(jwt)) {
      throw new UnauthorizedException('令牌无效');
    }
    const ok = await this.authService.jwtServicePublic.verify(jwt);
    if (!ok) {
      throw new UnauthorizedException('身份过期');
    }

    // request.user = await this.configs.getMaster();
    request.token = jwt;
    return true;
  }

  getRequest(context: ExecutionContext) {
    return getNestExecutionContextRequest(context);
  }
}
