import { ApiProperty } from "@nestjs/swagger";

/*
 * @FilePath: /nest-server/comment/create-comment-dto.ts
 * @author: Wibus
 * @Date: 2021-10-04 22:04:15
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-04 23:38:15
 * Coding With IU
 */
export class CreateCommentDto {
    cid: number; //comment id

    @ApiProperty()
    type: string //choose `post` or `page`

    @ApiProperty()
    path: string

    post: string //only ID

    @ApiProperty()
    content: string //comment content

    createTime: number

    @ApiProperty()
    author: string

    @ApiProperty()
    owner: String

    @ApiProperty()
    isOwner?: Boolean = true

    @ApiProperty()
    email: string

    @ApiProperty()
    url?: string = null

    @ApiProperty()
    key?: String = null

    @ApiProperty()
    hasChild: Boolean = false

    @ApiProperty()
    ipAddress?: string = null

    @ApiProperty()
    userAgent?: string = null
    
    @ApiProperty()
    state: number = 0 // 0 need checked, 1 push, 2 shit message
}
