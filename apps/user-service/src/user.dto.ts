import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

class UserOptionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nickname?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: '我是练习时长两年半的个人练习生',
    description: '用户昵称',
  })
  readonly description?: string;

  @ApiProperty({
    required: false,
    example: 'example@example.com',
    description: '用户邮箱',
  })
  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @ApiProperty({
    required: false,
    example: 'http://example.com',
    description: '用户主页链接',
  })
  @IsUrl({ require_protocol: true }, { message: '请更正为正确的网址' })
  @IsOptional()
  readonly url?: string;

  @ApiProperty({ required: false })
  @IsUrl({ require_protocol: true })
  @IsOptional()
  readonly avatar?: string;

  @IsOptional()
  @IsObject()
  @ApiProperty({ description: '各种社交 id 记录' })
  readonly socialIds?: Record<string, any>;
}

export class UserDto extends UserOptionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '用户名？' })
  readonly username: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty({ message: '密码？' })
  readonly password: string;
}

export class LoginDto {
  @ApiProperty({ required: true })
  @IsString({ message: '用户名？' })
  username: string;

  @ApiProperty({ required: true })
  @IsString({ message: '密码？' })
  password: string;
}

export class UserPatchDto extends UserOptionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsOptional()
  readonly password: string;
}
