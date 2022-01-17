/*
 * @FilePath: /GS-server/src/utils/getIP.util.ts
 * @author: Wibus
 * @Date: 2022-01-17 16:41:32
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-17 16:44:05
 * Coding With IU
 */

export const getIP = (req: any) => {
  const ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  return ip;
}
