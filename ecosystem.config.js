/*
 * @FilePath: /GS-server/ecosystem.config.js
 * @author: Wibus
 * @Date: 2021-10-07 08:35:04
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-07 08:36:14
 * Coding With IU
 */
module.exports = {
    apps: [
      {
        name: 'GS-server',
        script: 'pnpm run prod:start',
        autorestart: true,
        exec_mode: 'cluster',
        watch: false,
        instances: 2,
        max_memory_restart: '230M',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  }