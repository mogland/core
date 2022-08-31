/*
 * @FilePath: /nx-core/global.d.ts
 * @author: Wibus
 * @Date: 2022-08-27 23:15:54
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-31 20:59:02
 * Coding With IU
 */
import { Consola } from 'consola'
import 'zx-cjs/globals'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Document, PaginateModel } from 'mongoose'
declare global {
  export const isDev: boolean

  export const consola: Consola

  export type MongooseModel<T> = ModelType<T> & PaginateModel<T & Document>

}

export {}
