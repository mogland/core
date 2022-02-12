import { ApiProperty } from "@nestjs/swagger";

/*
 * @FilePath: /GS-server/src/shared/dto/create-friends-dto.ts
 * @author: Wibus
 * @Date: 2021-10-23 08:57:19
 * @LastEditors: Wibus
 * @LastEditTime: 2022-02-12 18:47:09
 * Coding With IU
 */
export class CreateFriendsDto {
  id: number;
  @ApiProperty()
    name: string;
  @ApiProperty()
    description?: string;
  @ApiProperty()
    website: string;
  @ApiProperty()
    image?: string;
  @ApiProperty()
    qq?: string;
  @ApiProperty()
    owner: number;
  @ApiProperty()
    check: number;
}
