/*
 * @FilePath: /GS-server/src/utils/getDataConfig.util.ts
 * @author: Wibus
 * @Date: 2021-12-19 08:33:14
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-24 17:28:38
 * Coding With IU
 */
export default () => ({
  host: process.env.DB_HOST ? process.env.DB_HOST : "127.0.0. ",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  database: process.env.DB_DATABASE ? process.env.DB_DATABASE : "gs-server",
  username: process.env.DB_USERNAME ? process.env.DB_USERNAME : "root",
  password: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : "root",
});