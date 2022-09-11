import { WriteStream } from 'fs';
import { fs, chalk } from 'zx-cjs';
import { resolve } from 'path';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getIp } from '../../utils/ip.util';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { LOG_DIR } from '~/shared/constants/path.constant';
import { REFLECTOR } from '~/shared/constants/system.constant';
import { HTTP_REQUEST_TIME } from '~/shared/constants/meta.constant';

type myError = {
  readonly status: number;
  readonly statusCode?: number;

  readonly message?: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  private errorLogPipe: WriteStream;
  constructor(@Inject(REFLECTOR) private reflector: Reflector) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception as myError)?.status ||
          (exception as myError)?.statusCode ||
          HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      (exception as any)?.response?.message ||
      (exception as myError)?.message ||
      '';

    const url = request?.raw?.url ? decodeURI(request.raw.url) : 'URL';
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      Logger.error(exception, undefined, 'Catch');

      // @ts-ignore
      if (!isDev) {
        this.errorLogPipe =
          this.errorLogPipe ??
          fs.createWriteStream(resolve(LOG_DIR, 'error.log'), {
            flags: 'a+',
            encoding: 'utf-8',
          });

        this.errorLogPipe.write(
          `[${new Date().toISOString()}] ${url}: ${
            (exception as any)?.response?.message ||
            (exception as myError)?.message
          }\n${(exception as Error).stack}\n`,
        );
      }
    } else {
      const ip = getIp(request);
      this.logger.warn(
        `IP: ${ip} Error Info: (${status}) ${message} Path: ${url}`,
      );
    }
    // @ts-ignore
    const prevRequestTs = this.reflector.get(HTTP_REQUEST_TIME, request as any);

    if (prevRequestTs) {
      const content = `${request.method} -> ${request.url}`;
      Logger.debug(
        `--- ResponseError ${content}${chalk.yellow(
          ` +${+new Date() - prevRequestTs}ms`,
        )}`,
        LoggingInterceptor.name,
      );
    }
    const res = (exception as any).response;
    response
      .status(status)
      .type('application/json')
      .send({
        ok: 0,
        code: res?.code || status,
        chMessage: res?.chMessage || res?.message,
        message:
          (exception as any)?.response?.message ||
          (exception as any)?.message ||
          'Unknown Error',
      });
  }
}
