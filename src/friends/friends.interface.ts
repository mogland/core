/*
 * @FilePath: /GS-server/src/friends/friends.interface.ts
 * @author: Wibus
 * @Date: 2021-10-23 08:57:19
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-23 09:01:52
 * Coding With IU
 */
export class CreateLinks {
  id: number;
  name: string;
  description?: string;
  website: string;
  image: string;
  qq: string;
  owner: string;
  check: boolean;

}