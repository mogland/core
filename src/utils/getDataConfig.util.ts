/*
 * @FilePath: /GS-server/src/utils/getDataConfig.util.ts
 * @author: Wibus
 * @Date: 2021-12-19 08:33:14
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-20 21:24:45
 * Coding With IU
 */
import { Envs } from "./Envs.utils";

export default () => {
  return {
    host: Envs("DB_HOST") ? Envs("DB_HOST") : "127.0.0.1",
    port: Envs("DB_PORT") ? Number(Envs("DB_PORT")) : 3306,
    database: Envs("DB_DATABASE") ? Envs("DB_DATABASE") : "nest-server",
    username: Envs("DB_USERNAME") ? Envs("DB_USERNAME") : "root",
    password: Envs("DB_PASSWORD") ? Envs("DB_PASSWORD") : "root",
  }
};