/*
 * @FilePath: /core/libs/config/src/config.default.ts
 * @author: Wibus
 * @Date: 2022-09-09 21:02:37
 * @LastEditors: ttimochan
 * @LastEditTime: 2022-09-27 23:53:26
 * Coding With IU
 */

import { ConfigsInterface } from './config.interface';

export const DefaultConfigs: () => ConfigsInterface = () => ({
  seo: {
    title: 'Mog',
    description: 'A Next generation blog system',
    keyword: ['blog', 'mog'],
  },
});
