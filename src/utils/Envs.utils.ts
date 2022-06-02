import { argv } from "zx";

/*
 * @FilePath: /nx-server/src/utils/chooseEnv.utils.ts
 * @author: Wibus
 * @Date: 2022-03-20 16:23:37
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-02 22:33:32
 * Coding With IU
 */
export const Envs = (name: any) => {
  // return argv.hasOwnProperty(name) ? argv[name] : process.env[name];
  // console.log(argv[name])
  return argv.hasOwnProperty(name) ? argv[name] : process.env[name];
  
}