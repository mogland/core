import { ApiProperty } from "@nestjs/swagger";

/*
 * @FilePath: /GS-server/src/comment/create-comment-dto.ts
 * @author: Wibus
 * @Date: 2021-10-04 22:04:15
 * @LastEditors: Wibus
 * @LastEditTime: 2021-12-04 06:28:45
 * Coding With IU
 */
export class CreateCommentDto {
  cid: number; //comment id

  @ApiProperty()
  type: string; //choose `post` or `page`

  @ApiProperty()
  path: string;

  post: string; //only ID

  @ApiProperty()
  content: string; //comment content

  createTime: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  owner: string;

  @ApiProperty()
  isOwner?: number = 0;

  @ApiProperty()
  email: string;

  @ApiProperty()
  url?: string = null;

  @ApiProperty()
  key?: string = null;

  @ApiProperty()
  hasChild?: number = 0;

  @ApiProperty()
  ipAddress?: string = null;

  @ApiProperty()
  userAgent?: string = null;

  @ApiProperty()
  state: number; // 0 need checked, 1 push, 2 shit message
}
