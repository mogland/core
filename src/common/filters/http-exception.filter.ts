import * as dayjs from 'dayjs';

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  // Global,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
// nest默认底层是基于express封装,所以可以直接引入
import { Request, Response } from 'express';
// 第三方logger
import { Logger } from 'nestjs-pino';

// 捕获请求异常类型
// 可以传递多个参数，所以你可以通过逗号分隔来为多个类型的异常设置过滤器。
// @Global()
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  // 我们要把异常塞到自定义logger,必须引入对应的实例
  // 在构建函数声明定义下,从外部传入
  constructor(private readonly logger: Logger) {}
  
  catch(exception: HttpException, host: ArgumentsHost) {
    // 把请求相关的参数转成标准http的上下文
    // 有兴趣可以点进去,GPRC,WEBSOCKET都能直接转换
    // 也能直接拿到一些参数的及返回上下文类型
    const ctx = host.switchToHttp();
    // 响应体
    const response = ctx.getResponse<Response>();
    // 请求体
    const request = ctx.getRequest<Request>();
    
    // 判断状态是否为请求异常,否则直接抛回来服务内部错误
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    // 此刻的时间
    const nowDate = dayjs(Date.now()).format('YYYY-MM-DDTHH:mm:ss');
    
    // 包装异常信息
    const errorResponse = {
      statusCode: status,
      message: exception.message,
      error: exception.name,
      date: nowDate,
      path: request.url,
    };

    // 记录异常信息到第三方logger
    this.logger.error(
      `【${nowDate}】${request.method} ${request.url} query:${JSON.stringify(
        request.query,
      )} params:${JSON.stringify(request.params)} body:${JSON.stringify(
        request.body,
      )}`,
      JSON.stringify(errorResponse),
      'HttpExceptionFilter',
    );
    
    // 塞回去响应体,也就是客户端请求可以感知到的
    response.status(status).json(errorResponse);
  }
}
