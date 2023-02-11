import { HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  timeout,
  catchError,
  throwError,
  lastValueFrom,
  Observable,
} from 'rxjs';

export function transportReqToMicroservice<T = any>(
  client: ClientProxy,
  cmd: string,
  data: any,
  toPromise?: undefined,
  time?: number,
): Observable<T>;
export function transportReqToMicroservice<T = any>(
  client: ClientProxy,
  cmd: string,
  data: any,
  toPromise?: boolean,
  time?: number,
): Promise<T>;
export function transportReqToMicroservice<T = any>(
  client: ClientProxy,
  cmd: string,
  data: any,
  toPromise?: boolean,
  time = 3000,
): Observable<T> | Promise<T> {
  const send = client.send<T>({ cmd }, data).pipe(
    timeout(time),
    catchError((err) => {
      return throwError(
        () => new HttpException(err.message || '未知错误', err.code || 500),
      );
    }),
  );

  return (toPromise ? lastValueFrom<T>(send) : send) as any;
}
