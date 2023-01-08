import { modelOptions, prop } from '@typegoose/typegoose';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { BaseModel } from '~/shared/model/base.model';

export enum FriendStatus {
  Pending = 0, // 待审核
  Approved = 1, // 已通过
  Spam = 2, // 垃圾友链
  Trash = 3, // 回收站友链
}

export enum FeedType {
  RSS = 0,
  Atom = 1,
}

@modelOptions({ options: { customName: 'Friends' } })
export class FriendsModel extends BaseModel {
  @prop({ required: true })
  @IsString()
  name: string;

  @prop({ required: true })
  @IsString()
  link: string;

  @prop()
  @IsString()
  @IsOptional()
  desc?: string;

  @prop()
  @IsString()
  @IsOptional()
  nickname?: string;

  @prop()
  @IsUrl()
  @IsOptional()
  avatar?: string;

  @prop()
  @IsEmail()
  @IsOptional()
  email?: string;

  @prop({ default: FriendStatus.Pending })
  @IsOptional()
  status?: FriendStatus;

  @prop()
  @IsString()
  @IsOptional()
  group?: string;

  @prop({ default: false })
  @IsOptional()
  autoCheck?: boolean;

  @prop()
  @IsUrl()
  @IsOptional()
  feed?: string;

  @prop({ default: FeedType.RSS })
  @IsOptional()
  feedType?: FeedType;

  @prop()
  @IsString()
  @IsOptional()
  feedContents?: string;
}
