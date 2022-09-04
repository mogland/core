/*
 * @FilePath: /nx-core/apps/core/src/modules/auth/auth.module.ts
 * @author: Wibus
 * @Date: 2022-09-04 14:35:39
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-04 14:39:54
 * Coding With IU
 */
import { Global, Module } from '@nestjs/common';
import { AuthService } from '~/libs/auth/src';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
@Global()
export class AuthModule {}
