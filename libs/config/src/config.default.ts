/*
 * @FilePath: /nx-core/libs/config/src/config.default.ts
 * @author: Wibus
 * @Date: 2022-09-09 21:02:37
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-09 21:04:07
 * Coding With IU
 */

import { ConfigsInterface } from './config.interface';

export const DefaultConfigs: () => ConfigsInterface = () => ({
  seo: {
    title: 'N-x',
    description: 'A Next generation blog system',
    keyword: ['blog', 'nx-space'],
  },
});
