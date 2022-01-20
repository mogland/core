import { ApiProperty } from "@nestjs/swagger";

/*
 * @FilePath: /GS-server/src/shared/dto/create-category-dto.ts
 * @author: Wibus
 * @Date: 2021-10-16 07:05:59
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-20 12:06:28
 * Coding With IU
 */
export class CreateCategoryDto {
  @ApiProperty()
    id?: number;
  @ApiProperty()
    name: string;
  @ApiProperty()
    slug: string;
}
