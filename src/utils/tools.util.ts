import { chooseEnv } from "./chooseEnv.utils";

/*
 * @FilePath: /GS-server/src/utils/tools.util.ts
 * @author: Wibus
 * @Date: 2021-10-07 08:45:07
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-20 17:22:36
 * Coding With IU
 */
export const isDev = chooseEnv("NODE_ENV") == "development";
