/*
 * @FilePath: /nest-server/src/core/function/xss.ts
 * @author: Wibus
 * @Date: 2021-09-25 16:53:10
 * @LastEditors: Wibus
 * @LastEditTime: 2021-09-25 16:56:00
 * Coding With IU
 */
function delXss(value: any){
    let xss = require("xss")
    let data = xss(value)
    return data
}
export default delXss