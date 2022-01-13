/*
 * @FilePath: /GS-server/src/utils/getDataConfig.util.ts
 * @author: Wibus
 * @Date: 2021-12-19 08:33:14
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-13 23:02:42
 * Coding With IU
 */
export default () => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});