/*
 * @FilePath: /GS-server/src/utils/bcrypt.utils.ts
 * @author: Wibus
 * @Date: 2022-01-21 23:42:36
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-21 23:49:15
 * Coding With IU
 */
import { hashSync } from 'bcryptjs';

export default function encodePassword(password: string) {
  return hashSync(password, 10);
}