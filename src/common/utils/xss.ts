/*
 * @FilePath: /GS-server/src/common/utils/xss.ts
 * @author: Wibus
 * @Date: 2021-09-25 16:53:10
 * @LastEditors: Wibus
 * @LastEditTime: 2021-12-04 06:12:27
 * Coding With IU
 */
import xss from "xss";
function delXss(value: any) {
  const xssS = xss;
  const data = xssS(value);
  return data;
}
export default delXss;
