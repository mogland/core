/*
 * @FilePath: /GS-server/src/common/utils/xss.ts
 * @author: Wibus
 * @Date: 2021-09-25 16:53:10
 * @LastEditors: Wibus
 * @LastEditTime: 2021-12-04 06:49:44
 * Coding With IU
 */
function delXss(value: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const xss = require("xss");
  const data = xss(value);
  return data;
}
export default delXss;
