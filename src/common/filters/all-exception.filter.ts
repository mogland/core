/*
 * @FilePath: /GS-server/src/common/filters/all-exception.filter.ts
 * @author: Wibus
 * @Date: 2022-01-14 20:39:52
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-14 20:52:53
 * Coding With IU
 */

import { ArgumentsHost, Catch, ExceptionFilter, Logger } from "@nestjs/common";

type ErrorMessage = {
  message?: string
  status: number
  statusCode?: number
}
@Catch()
export class AllExceptionFilter implements ExceptionFilter{
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    const message: ErrorMessage = {
      message: "服务器异常",
      status: 500,
      statusCode: 500,
    }
    if (exception.message) {
      message.message = exception.message
    }
    if (exception.status) {
      message.status = exception.status
    }
    if (exception.statusCode) {
      message.statusCode = exception.statusCode
    }
    Logger.log('[gSpaceHelper] Oops! w(ﾟДﾟ)w 出错了! Path:' + request.originalUrl + 'Status:' + exception.status + 'Message: ' + message);
    response
      .status(message.status).json(message)
      .type('application/json')
      .send(message)
  }
}