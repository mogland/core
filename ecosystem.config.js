const { execSync } = require('child_process')
const nodePath = execSync(`npm root --quiet -g`, { encoding: 'utf-8' }).split(
  '\n',
)[0]
const args = {
  autorestart: true,
  watch: false,
  max_memory_restart: '230M',
  env: {
    NODE_ENV: 'production',
    NODE_PATH: nodePath,
  },
}

module.exports = {
  apps: [
    {
      name: 'Mog Gateway',
      script: 'out/core/index.js',
      ...args,
    },
    {
      name: 'Mog Config',
      script: 'out/config-service/index.js',
      ...args,
    },
    {
      name: 'Mog Friends',
      script: 'out/friends-service/index.js',
      ...args,
    },
    {
      name: 'Mog User',
      script: 'out/user-service/index.js',
      ...args,
    },
    {
      name: 'Mog Pages',
      script: 'out/page-service/index.js',
      ...args,
    },
    {
      name: 'Mog Notifications',
      script: 'out/notification-service/index.js',
      ...args,
    },
    {
      name: 'Mog Comments',
      script: 'out/comments-service/index.js',
      ...args,
    },
    {
      name: 'Mog Themes',
      script: 'out/themes-service/index.js',
      ...args,
    },
    {
      name: 'Mog Store',
      script: 'out/store-service/index.js',
      ...args,
    }
  ],
}