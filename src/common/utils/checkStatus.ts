/*
 * @FilePath: /Nest-server/function/checkStatus.ts
 * @author: Wibus
 * @Date: 2021-09-26 22:32:28
 * @LastEditors: Wibus
 * @LastEditTime: 2021-09-26 22:34:56
 * Coding With IU
 */
import fetch from "node-fetch";
async function checkStatus(url: string) {
  const response = await fetch(url);
  if (response.status >= 200 && response.status < 299) {
    console.log("true" + response.status);
    return true;
  } else {
    console.log("false" + response.status);
    return false;
  }
}
export default checkStatus;
