/*
 * @FilePath: /nx-core/apps/page-service/src/dto/post.dto.ts
 * @author: Wibus
 * @Date: 2022-09-18 15:13:38
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-18 15:13:39
 * Coding With IU
 */

import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CategoryAndSlugDto {
  @IsString()
  readonly category: string;

  @IsString()
  @Transform(({ value: v }) => decodeURI(v))
  readonly slug: string;
}

export class PostVerifyDto {
  readonly password: string | undefined | null;
}
