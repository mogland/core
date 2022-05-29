import { ApiProperty } from "@nestjs/swagger";

/*
 * @FilePath: /nx-server/src/shared/dto/create-comments-dto.ts
 * @author: Wibus
 * @Date: 2021-10-04 22:04:15
 * @LastEditors: Wibus
 * @LastEditTime: 2022-05-29 12:11:29
 * Coding With IU
 */
export class CreateCommentsDto {

  // coid: number
  
  @ApiProperty()
    type: string; //choose `post` or `page`

  @ApiProperty()
    cid: number; //Pages/Post id

  // @ApiProperty()
  //   created: number;

  @ApiProperty()
    author: string;

  @ApiProperty()
    email: string;

  @ApiProperty()
    url?: string = null;

  @ApiProperty()
    text: string; //Comments content

  // 在建立记录的时候就把后期需要用到的slug直接生成，方便了前端的调用。这是一个原因。
  // 当然这不是重点，通过层次命名的 key，对删除父评论相当方便。
  @ApiProperty()
    key: string;

  @ApiProperty()
    ip?: string = null;

  @ApiProperty()
    userAgent?: string = null;

  @ApiProperty()
    status: number;  // 0 need checked, 1 push, 2 shit message

  @ApiProperty()
    parent: number; //parent coid
}
