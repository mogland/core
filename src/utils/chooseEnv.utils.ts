import { argv } from "zx";

/*
 * @FilePath: /GS-server/src/utils/chooseEnv.utils.ts
 * @author: Wibus
 * @Date: 2022-03-20 16:23:37
 * @LastEditors: Wibus
 * @LastEditTime: 2022-04-05 17:58:42
 * Coding With IU
 */
export const chooseEnv = (name: any) => {
  // return argv.hasOwnProperty(name) ? argv[name] : process.env[name];
  // console.log(argv[name])
  return argv.hasOwnProperty(name) ? argv[name] : process.env[name];
  
}