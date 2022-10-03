/*
 * @FilePath: /nx-core/shared/utils/redis.util.ts
 * @author: Wibus
 * @Date: 2022-08-31 19:55:15
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-31 19:55:16
 * Coding With IU
 */

import { RedisKeys } from '../constants/cache.constant';

type Prefix = 'next';
const prefix = 'next';

export const getRedisKey = <T extends string = RedisKeys | '*'>(
  key: T,
  ...concatKeys: string[]
): `${Prefix}:${T}${string | ''}` => {
  return `${prefix}:${key}${
    concatKeys && concatKeys.length ? `:${concatKeys.join('_')}` : ''
  }`;
};
