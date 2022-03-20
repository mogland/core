import { argv } from "zx";

/*
 * @FilePath: /GS-server/src/utils/chooseEnv.utils.ts
 * @author: Wibus
 * @Date: 2022-03-20 16:23:37
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-20 21:37:15
 * Coding With IU
 */
export const chooseEnv = (name: any) => {
  return argv.hasOwnProperty(name) ? argv[name] : process.env[name];
}