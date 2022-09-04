/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*
 * @FilePath: /nx-core/libs/config/src/configs.default.ts
 * @author: Wibus
 * @Date: 2022-09-04 15:08:56
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-04 15:12:56
 * Coding With IU
 */

import { IConfig } from './configs.interface';

export const generateDefaultConfig: () => IConfig = () => ({
  seo: {
    title: '我的小世界呀',
    description: '哈喽~欢迎光临',
    keywords: [],
  },
  url: {
    wsUrl: 'http://127.0.0.1:2333', // todo
    adminUrl: 'http://127.0.0.1:2333/proxy/qaqdmin',
    serverUrl: 'http://127.0.0.1:2333',
    webUrl: 'http://127.0.0.1:2323',
  },
  mailOptions: {
    enable: false,

    user: '',
    pass: '',
    options: {
      host: '',
      port: 465,
    },
  },
  commentOptions: {
    antiSpam: false,
    blockIps: [],
    disableNoChinese: false,
    fetchLocationTimeout: 3000,
    recordIpLocation: true,
    spamKeywords: [],
    commentShouldAudit: false,
  },
  backupOptions: {
    enable: true,
    region: null!,
    bucket: null!,
    secretId: null!,
    secretKey: null!,
  },
  friendLinkOptions: { allowApply: true },

  adminExtra: {
    enableAdminProxy: true,
    title: 'おかえり~',
    background: '',
    gaodemapKey: null!,
  },
});
