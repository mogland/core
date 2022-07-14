/*
 * @FilePath: /nx-core/src/modules/configs/configs.init.ts
 * @author: Wibus
 * @Date: 2022-06-22 07:47:57
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-14 16:21:30
 * Coding With IU
 */

import { ConfigsInterface } from "./configs.interface";

export const generateInitConfigs: () => ConfigsInterface = () => ({
  site: {
    title: 'Nx Core',
    description: 'Hi, I am Wibus',  
    keywords: [],
  },
  urls: {
    webUrl: 'http://localhost:3000',
    coreUrl: 'http://localhost:3000/api/core',
    adminUrl: 'http://localhost:3000/admin',
  },
  mailOptions: {
    enable: false,
    host: 'smtp.qq.com',
    port: 465,
    auth: {
      // user: '',
      // pass: '',
    },
  },
  admin: {
    title: 'Nx Core',
    background: '',
  },
  // theme: {
  //   name: 'default', // 模板名
  //   config: {} // 模板配置项
  // },
  // plugins: [],
})