/*
 * @FilePath: /GS-server/src/utils/xss.util.ts
 * @author: Wibus
 * @Date: 2021-09-25 16:53:10
 * @LastEditors: Wibus
 * @LastEditTime: 2022-02-07 22:04:35
 * Coding With IU
 */
export function delXss(value: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const xss = require("xss");
  const data = xss(value);
  return data;
}
export function delObjXss(obj: any){
  for(const key in obj){
    if(typeof obj[key] === 'string'){
      obj[key] = delXss(obj[key])
    }
  }
  return obj
}
