/*
 * @FilePath: /nx-server/src/utils/tools.util.ts
 * @author: Wibus
 * @Date: 2021-10-07 08:45:07
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-07 08:41:02
 * Coding With IU
 */

import { Envs } from "./Envs.utils";
import { cloneDeep, isObject } from 'lodash'

export const isDev = Envs("NODE_ENV") == "development";

export const deepCloneWithFunction = <T extends object>(object: T): T => {
  const clonedModule = cloneDeep(object)

  if (typeof object === 'function') {
    // @ts-expect-error
    const newFunc = (object as Function).bind()

    Object.setPrototypeOf(newFunc, clonedModule)
    return newFunc
  }

  return clonedModule
}