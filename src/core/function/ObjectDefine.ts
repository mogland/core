/*
 * @FilePath: /nest-server/src/core/function/ObjectDefine.ts
 * @author: Wibus
 * @Date: 2021-09-25 16:45:46
 * @LastEditors: Wibus
 * @LastEditTime: 2021-09-25 16:48:43
 * Coding With IU
 */
function objAdd(data: any, where: PropertyKey, value: any, writable = false){
    Object.defineProperty(data, where, {
        value: value,
        writable: writable,
    })
}
export default objAdd