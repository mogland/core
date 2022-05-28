/* eslint-disable @typescript-eslint/no-var-requires */
/*
 * @FilePath: /nx-server/ecosystem.config.js
 * @author: Wibus
 * @Date: 2021-10-07 08:35:04
 * @LastEditors: Wibus
 * @LastEditTime: 2022-05-28 22:24:31
 * Coding With IU
 */
const { cpus } = require('os')
const { execSync } = require('child_process')
const nodePath = execSync(`npm root --quiet -g`, { encoding: 'utf-8' }).split(
  '\n',
)[0]

const cpuLen = cpus().length
module.exports = {
  apps: [
    {
      name: 'nx-server',
      script: 'index.js',
      autorestart: true,
      exec_mode: 'cluster',
      watch: false,
      instances: Math.max(2, cpuLen),
      max_memory_restart: '230M',
      args: '--color',
      env: {
        NODE_ENV: 'production',
        NODE_PATH: nodePath,
      },
    },
  ],
}