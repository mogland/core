/*
 * @FilePath: /mog-core/shared/utils/index.ts
 * @author: Wibus
 * @Date: 2022-08-31 19:59:37
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-11 13:46:10
 * Coding With IU
 */

export * from './redis.util';
export * from './rss-parser.util';
export * from './safe-eval.util';
export * from './time.util';
export * from './validator/isBooleanOrString';
export * from './validator/isNilOrString';

export const md5 = (text: string) =>
  require('crypto').createHash('md5').update(text).digest('hex');

export function getAvatar(mail: string | undefined) {
  if (!mail) {
    return '';
  }
  return `https://sdn.geekzu.org/avatar/${md5(mail)}?d=retro`;
}
