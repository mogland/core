import { ApiProperty } from "@nestjs/swagger";

/*
 * @FilePath: /GS-server/src/friends/create-friends-dto.ts
 * @author: Wibus
 * @Date: 2021-10-23 08:57:19
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-23 12:01:52
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
  image: string;
  @ApiProperty()
  qq: string;
  @ApiProperty()
  owner: string;
  @ApiProperty()
  check: boolean;

}