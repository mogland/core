/* eslint-disable import/order */
import { Logger } from '@nestjs/common'
import { chalk, $ } from 'zx-cjs'
import { mkdirSync } from 'fs'
import 'zx/globals'
import { DATA_DIR, LOG_DIR, PLUGIN_DIR } from '~/constants/path.constant'
import { consola, registerStdLogger } from './consola.global'
import './dayjs.global'
import { isDev } from './env.global'

// 建立目录
function mkdirs() {
  mkdirSync(DATA_DIR, { recursive: true })
  Logger.log(chalk.blue(`数据文件夹 已准备好: ${DATA_DIR}`))

  mkdirSync(LOG_DIR, { recursive: true })
  Logger.log(chalk.blue(`日志文件夹 已准备好: ${LOG_DIR}`))

  mkdirSync(PLUGIN_DIR, { recursive: true })
  Logger.log(chalk.blue(`插件文件夹 已准备好: ${PLUGIN_DIR}`))
}

function registerGlobal() {
  $.verbose = isDev
  Object.assign(globalThis, {
    isDev,
    consola,
  })
  console.debug = (...rest) => {
    if (isDev) {
      consola.log.call(console, ...rest)
    }
  }
}

export function register() {
  mkdirs()
  registerStdLogger()

  registerGlobal()
}
