import { modelOptions, prop } from '@typegoose/typegoose';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { BaseModel } from '~/shared/model/base.model';

export enum FriendStatus {
  Pending,
  Approved,
  Ban,
}

export enum FeedType {
  RSS,
  ATOM,
}

export enum FriendType {
  UNIDIRECTION, // 单向
  BIDIRECTION, // 双向
}

@modelOptions({ options: { customName: 'Friends' } })
export class FriendsModel extends BaseModel {
  @prop({ required: true, trim: true })
  @IsString()
  name: string;

  @prop({ required: true, trim: true })
  @IsString()
  @IsUrl()
  link: string;

  @prop({ required: true })
  @IsString()
  @IsUrl()
  avatar: string;

  @prop({ required: true })
  @IsString()
  description: string;

  @prop({ required: true, trim: true })
  @IsString()
  @IsEmail()
  email: string;

  @prop({ default: FriendStatus.Pending })
  @IsNumber()
  @IsOptional()
  status?: FriendStatus;

  // They are used in the friends microservice.

  // @prop({ default: FriendType.UNIDIRECTION })
  // @IsNumber()
  // @IsOptional()
  // type?: FriendType;

  // @prop()
  // @IsString()
  // @IsUrl()
  // @IsOptional()
  // feed: string;

  // @prop({ default: FeedType.RSS })
  // @IsNumber()
  // @IsOptional()
  // feedType?: FeedType;
}
