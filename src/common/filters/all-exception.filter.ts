/*
 * @FilePath: /GS-server/src/common/filters/all-exception.filter.ts
 * @author: Wibus
 * @Date: 2022-01-14 20:39:52
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-15 15:16:51
 * Coding With IU
 */

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

type ErrorMessage = {
  message?: string
  status: number
  statusCode?: number
  error?: string
  url: string
}
@Catch()
export class AllExceptionFilter implements ExceptionFilter{
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
    exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message;
    Logger.log('[gSpaceHelper] Oops! w(ﾟДﾟ)w 出错了! Path:' + request.originalUrl + ' 错误信息: ' + message);
    const errorResponse: ErrorMessage = {
      status: status,
      message: message,
      error: message,
      url: request.originalUrl, // 错误的url地址
    };
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}