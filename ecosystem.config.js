/*
 * @FilePath: /GS-server/ecosystem.config.js
 * @author: Wibus
 * @Date: 2021-10-07 08:35:04
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-20 14:10:44
 * Coding With IU
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { cpus } = require('os')

const cpuLen = cpus().length
module.exports = {
  apps: [
    {
      name: 'GS-server',
      script: 'pnpm prod:start',
      autorestart: true,
      exec_mode: 'cluster',
      watch: false,
      instances: Math.min(2, cpuLen),
      max_memory_restart: '230M',
      args: '--color',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
