/* eslint-disable no-useless-escape */
/* eslint-disable import/order */
import { Logger } from '@nestjs/common';
import { chalk, $ } from 'zx-cjs';
import { mkdirSync } from 'fs';
import 'zx-cjs/globals';
import {
  DATA_DIR,
  LOG_DIR,
  STORE_DIR,
  THEME_DIR,
} from '@shared/constants/path.constant';
import { consola } from './consola.global';
import './dayjs.global';
import { isDev } from '@shared/global/env.global';
import { join } from 'path';
import { MOG_NAME_ASCIIS_MAP } from '../constants/asciis.constants';

function consoleMog() {
  console.log(MOG_NAME_ASCIIS_MAP['shadow']);
}

// mkdirSync(PLUGIN_DIR, { recursive: true });
// Logger.log(chalk.blue(`插件文件夹 已准备好: ${PLUGIN_DIR}`));

// mkdirSync(PUBLIC_DIR, { recursive: true });
// Logger.log(chalk.blue(`公共文件夹 已准备好: ${PUBLIC_DIR}`));

export function mkBasedirs() {
  mkdirSync(DATA_DIR, { recursive: true });
  Logger.log(chalk.blue(`数据文件夹 已准备好: ${DATA_DIR}`));
}

export function mkThemeDir() {
  mkBasedirs();
  mkdirSync(THEME_DIR, { recursive: true });
  mkdirSync(join(THEME_DIR), { recursive: true });
  Logger.log(chalk.blue(`主题文件夹 已准备好: ${THEME_DIR}`));
}

export function mkLogDir(service: string) {
  mkBasedirs();
  const dir = join(LOG_DIR, `${service}_service`);
  mkdirSync(dir, { recursive: true });
  Logger.log(chalk.blue(`日志文件夹 已准备好: ${dir}`));
}

export function mkStoreDir() {
  mkdirSync(STORE_DIR, { recursive: true });
  Logger.log(chalk.blue(`储藏文件夹 已准备好: ${STORE_DIR}`));
}

export function registerGlobal() {
  $.verbose = isDev;
  // Object.assign(globalThis, {
  //   isDev,
  //   consola,
  // });
  console.debug = (...rest) => {
    if (isDev) {
      consola.log.call(console, ...rest);
    }
  };
}

export function register() {
  // registerGlobal();
  consoleMog();
  // registerStdLogger();
}
