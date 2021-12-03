/*
 * @FilePath: /nest-server/function/ObjectDefine.ts
 * @author: Wibus
 * @Date: 2021-09-25 16:45:46
 * @LastEditors: Wibus
 * @LastEditTime: 2021-09-25 21:50:29
 * Coding With IU
 */
function objAdd(data: any, name: PropertyKey, value: any, writable = false) {
  Object.defineProperty(data, name, {
    value: value,
    writable: writable,
  });
}
export default objAdd;
