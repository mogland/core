/*
 * @FilePath: /nx-core/src/modules/post/post.dto.ts
 * @author: Wibus
 * @Date: 2022-06-21 23:59:41
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-17 22:38:09
 * Coding With IU
 */

import { Transform } from "class-transformer";
import { IsString } from "class-validator";

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
