/*
 * @FilePath: /GS-server/src/utils/nest.util.ts
 * @author: Wibus
 * @Date: 2022-01-14 21:00:50
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-14 21:03:04
 * Coding With IU
 */
import { ArgumentsHost } from "@nestjs/common";

export function getNestExecutionContextRequest(host: ArgumentsHost){
  return host.switchToHttp().getRequest()
}