/*
 * @FilePath: /nx-core/src/modules/aggregate/aggregate.dto.ts
 * @author: Wibus
 * @Date: 2022-07-10 15:53:57
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-10 15:53:57
 * Coding With IU
 */

import { Transform } from "class-transformer";
import { Min, Max, IsOptional } from "class-validator";

export class TopQueryDto {
  @Transform(({ value: val }) => parseInt(val))
  @Min(1)
  @Max(10)
  @IsOptional()
  size?: number
}