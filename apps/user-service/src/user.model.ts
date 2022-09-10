/*
 * @FilePath: /nx-core/apps/user-service/src/user.model.ts
 * @author: Wibus
 * @Date: 2022-09-04 13:58:22
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-10 22:35:06
 * Coding With IU
 */

import {
  modelOptions,
  prop,
  Severity,
  DocumentType,
} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { hashSync } from 'bcrypt';
import { BaseModel } from '~/shared/model/base.model';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = DocumentType<UserModel>;

export enum UserRole {
  root,
  author,
  visitor,
}

export class OAuthModel {
  @prop()
  platform: string;
  @prop()
  id: string;
}

export class TokenModel {
  @prop()
  created: Date;

  @prop()
  token: string;

  @prop()
  expired?: Date;

  @prop({ unique: true })
  name: string;
}

@modelOptions({ options: { customName: 'User', allowMixed: Severity.ALLOW } })
export class UserModel extends BaseModel {
  @prop({ required: true, unique: true, trim: true })
  @ApiProperty({ description: '用户名' })
  username!: string;

  @prop({ trim: true })
  @ApiProperty({ description: '用户昵称' })
  nickname!: string;

  @prop()
  @ApiProperty({ description: '用户描述' })
  description?: string;

  @prop()
  @ApiProperty({ description: '用户头像' })
  avatar?: string;

  @prop({
    select: false,
    get(val) {
      return val;
    },
    set(val) {
      return hashSync(val, 6);
    },
    required: true,
  })
  @ApiProperty({ description: '用户密码' })
  password!: string;

  @prop()
  @ApiProperty({ description: '用户邮箱' })
  email?: string;

  @prop()
  @ApiProperty({ description: '用户主页链接' })
  url?: string;

  @prop()
  @ApiProperty({ description: '用户最后一次登陆的时间' })
  lastLoginTime?: Date;

  @prop({ select: false })
  @ApiProperty({ description: '用户最后一次登陆 IP' })
  lastLoginIp?: string;

  @prop({ type: mongoose.Schema.Types.Mixed })
  @ApiProperty({ description: '用户社交账户 ID' })
  socialIds?: any;

  @prop({ select: false, required: true })
  @ApiProperty({ description: '用户登录授权码' })
  authCode!: string;

  @prop({ type: TokenModel, select: false })
  @ApiProperty({ description: 'API 密钥' })
  apiToken?: TokenModel[];

  // @prop({ type: OAuthModel, select: false })
  // @ApiProperty({ description: 'OAUTH 授权' })
  // oauth2?: OAuthModel[];

  // @prop({ enum: UserRole, default: UserRole.visitor })
  // @ApiProperty({ description: '用户角色' })
  // role?: UserRole;
}
