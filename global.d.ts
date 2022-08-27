/*
 * @FilePath: /nx-core/global.d.ts
 * @author: Wibus
 * @Date: 2022-08-27 23:15:54
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-27 23:15:54
 * Coding With IU
 */
import { Consola } from 'consola'
import 'zx-cjs/globals'

declare global {
  export const isDev: boolean

  export const consola: Consola

}

export {}