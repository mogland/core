/*
 * @FilePath: /nx-core/src/modules/links/links.dto.ts
 * @author: Wibus
 * @Date: 2022-07-11 11:52:11
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-11 12:09:28
 * Coding With IU
 */

import { IsString, MaxLength } from "class-validator";
import { LinksModel } from "./links.model";


export class linksDto extends LinksModel {
  @IsString({ message: '大名只能字符串, 哼！' })
  @MaxLength(20, { message: '你的名字是真滴长啊2333' })
  author: string
}