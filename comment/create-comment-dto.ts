/*
 * @FilePath: /nest-server/comment/create-comment-dto.ts
 * @author: Wibus
 * @Date: 2021-10-04 22:04:15
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-04 23:25:41
 * Coding With IU
 */
export class CreateCommentDto {
    cid: number; //comment id
    type: string //choose `post` or `page`
    path: string
    post: string //only ID
    content: string //comment content
    createTime: number
    author: string
    owner: String
    isOwner?: Boolean = true
    email: string
    url?: string = null
    key?: String = null
    hasChild: Boolean = false
    ipAddress?: string = null
    userAgent?: string = null
    state: number = 0 // 0 need checked, 1 push, 2 shit message
}
