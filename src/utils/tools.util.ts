/*
 * @FilePath: /nx-core/src/utils/tools.util.ts
 * @author: Wibus
 * @Date: 2022-06-07 22:08:31
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-07 22:08:31
 * Coding With IU
 */

export const md5 = (text: string) =>
  require("crypto").createHash("md5").update(text).digest("hex");

export function getAvatar(mail: string | undefined) {
  if (!mail) {
    return "";
  }
  return `https://sdn.geekzu.org/avatar/${md5(mail)}?d=retro`;
}
