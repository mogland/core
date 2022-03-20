import { chooseEnv } from "utils/chooseEnv.utils";

/*
 * @FilePath: /GS-server/src/configs.ts
 * @author: Wibus
 * @Date: 2021-10-04 15:21:24
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-20 17:20:22
 * Coding With IU
 */
const configs = {
  expiration: 86400, // token expiration time
  jwtToken: chooseEnv("JWT_KEY") ? chooseEnv("JWT_KEY") : 'asodijoweidjeoaiwod', // jwt token
  get(name: any) {
    return this.hasOwnProperty(name) ? this[name] : null;
  }
};
export default configs;
