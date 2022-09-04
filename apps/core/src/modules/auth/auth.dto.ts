/*
 * @FilePath: /nx-core/apps/core/src/modules/auth/auth.dto.ts
 * @author: Wibus
 * @Date: 2022-09-04 14:35:49
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-04 14:39:23
 * Coding With IU
 */
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';

export class TokenDto {
  @IsDate()
  @IsOptional()
  @Transform(({ value: v }) => new Date(v))
  expired?: Date;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class OAuthVerifyQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  code: string;
}
