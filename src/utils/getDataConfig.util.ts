/*
 * @FilePath: /GS-server/src/utils/getDataConfig.util.ts
 * @author: Wibus
 * @Date: 2021-12-19 08:33:14
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-20 21:24:45
 * Coding With IU
 */
import { chooseEnv } from "./chooseEnv.utils";

export default () => {
  return {
    host: chooseEnv("DB_HOST") ? chooseEnv("DB_HOST") : "127.0.0.1",
    port: chooseEnv("DB_PORT") ? Number(chooseEnv("DB_PORT")) : 3306,
    database: chooseEnv("DB_DATABASE") ? chooseEnv("DB_DATABASE") : "nest-server",
    username: chooseEnv("DB_USERNAME") ? chooseEnv("DB_USERNAME") : "root",
    password: chooseEnv("DB_PASSWORD") ? chooseEnv("DB_PASSWORD") : "root",
  }
};