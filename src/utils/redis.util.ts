/*
 * @FilePath: /nx-core/src/utils/redis.util.ts
 * @author: Wibus
 * @Date: 2022-06-25 22:26:37
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-25 22:28:02
 * Coding With IU
 */
// import { isInDemoMode } from '~/app.config'
import { RedisKeys } from "~/constants/cache.constant";

type Prefix = "next";
const prefix = "next";

export const getRedisKey = <T extends string = RedisKeys | "*">(
  key: T,
  ...concatKeys: string[]
): `${Prefix}:${T}${string | ""}` => {
  return `${prefix}:${key}${
    concatKeys && concatKeys.length ? `:${concatKeys.join("_")}` : ""
  }`;
};
