import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const message = exception.message;
    switch (exception.getStatus()) {
    case HttpStatus.UNAUTHORIZED:
      Logger.warn('[gSpaceHelper] X﹏X 有人企图登陆！返回信息: ' + message);
      break;
    default:
      Logger.log('Oops! w(ﾟДﾟ)w 出错了! Path:' + request.originalUrl + '错误信息: ' + message, "gSpaceHelper");
      break;
    }
    const errorResponse = {
      statusCode: exception.getStatus(),
      message: message,
      error: message,
      url: request.originalUrl, // 错误的url地址
    };
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 设置返回的状态码、请求头、发送错误信息
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}
