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
      script: './core/index.js',
      ...args,
    },
    {
      name: 'Mog Friends',
      script: './friends-service/index.js',
      ...args,
    },
    {
      name: 'Mog User',
      script: './user-service/index.js',
      ...args,
    },
    {
      name: 'Mog Pages',
      script: './page-service/index.js',
      ...args,
    },
    {
      name: 'Mog Notifications',
      script: './notification-service/index.js',
      ...args,
    },
    {
      name: 'Mog Comments',
      script: './comments-service/index.js',
      ...args,
    },
    {
      name: 'Mog Themes',
      script: './themes-service/index.js',
      ...args,
    },
    {
      name: 'Mog Store',
      script: './store-service/index.js',
      ...args,
    }
  ],
}