import { HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  timeout,
  catchError,
  throwError,
  lastValueFrom,
  Observable,
} from 'rxjs';

export function transportReqToMicroservice<T = boolean>(
  client: ClientProxy,
  cmd: string,
  data: any,
  toPromise?: T,
  time = 3000,
): T extends true ? Promise<any> : Observable<any> {
  const send = client.send({ cmd }, data).pipe(
    timeout(time),
    catchError((err) => {
      return throwError(
        () => new HttpException(err.message || '未知错误', err.code || 500),
      );
    }),
  );

  type R = T extends true ? Promise<any> : Observable<any>;
  return toPromise ? (lastValueFrom(send) as R) : (send as R);
}
