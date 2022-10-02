/*
 * @FilePath: /mog-core/global.d.ts
 * @author: Wibus
 * @Date: 2022-10-02 23:42:03
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-02 23:42:03
 * Coding With IU
 */
import { Consola } from 'consola';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Document, PaginateModel } from 'mongoose';
import 'zx-cjs/globals';

declare global {
  export const isDev: boolean;

  export const consola: Consola;

  export type MongooseModel<T> = ModelType<T> & PaginateModel<T & Document>;
}

export {};
