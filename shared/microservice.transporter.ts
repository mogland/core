import { HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, catchError, throwError } from 'rxjs';

export function transportReqToMicroservice(
  client: ClientProxy,
  cmd: string,
  data: any,
  time = 3000,
) {
  return client.send({ cmd }, data).pipe(
    timeout(time),
    catchError((err) => {
      return throwError(
        () => new HttpException(err.message || '未知错误', err.code || 500),
      );
    }),
  );
}
