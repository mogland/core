import { HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  timeout,
  catchError,
  throwError,
  lastValueFrom,
} from 'rxjs';

export function transportReqToMicroservice<T = any>(
  client: ClientProxy,
  cmd: string,
  data: any,
  time = 3000,
):Promise<T> {
  const send = client.send<T>({ cmd }, data).pipe(
    timeout(time),
    catchError((err) => {
      return throwError(
        () => new HttpException(err.message || '未知错误', err.code || 500),
      );
    }),
  );

  return  lastValueFrom<T>(send);
}
