/*
 * @FilePath: /core/libs/config/src/config.default.ts
 * @author: Wibus
 * @Date: 2022-09-09 21:02:37
 * @LastEditors: ttimochan
 * @LastEditTime: 2022-09-27 23:38:15
 * Coding With IU
 */

import { ConfigsInterface } from './config.interface';

export const DefaultConfigs: () => ConfigsInterface = () => ({
  seo: {
    title: 'N-x',
    description: 'A Next generation blog system',
    keyword: ['blog', 'mogland'],
  },
});
