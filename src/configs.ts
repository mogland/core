/*
 * @FilePath: /GS-server/src/configs.ts
 * @author: Wibus
 * @Date: 2021-10-04 15:21:24
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-19 05:43:22
 * Coding With IU
 */
const configs = {
  expiration: 86400, // token expiration time
  jwtToken: process.env.JWT_KEY ? process.env.JWT_KEY : 'asodijoweidjeoaiwod', // jwt token
};
export default configs;
