/* eslint-disable no-useless-escape */
/* eslint-disable import/order */
import { Logger } from '@nestjs/common';
import { chalk, $ } from 'zx-cjs';
import { mkdirSync } from 'fs';
import 'zx-cjs/globals';
import {
  DATA_DIR,
  LOG_DIR,
  PLUGIN_DIR,
  PUBLIC_DIR,
  THEME_DIR,
} from '@shared/constants/path.constant';
import { consola, registerStdLogger } from './consola.global';
import './dayjs.global';
import { isDev } from './env.global';
import { join } from 'path';
import { Consola } from 'consola';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Document, PaginateModel } from 'mongoose';

declare global {
  export const isDev: boolean;

  export const consola: Consola;

  export type MongooseModel<T> = ModelType<T> & PaginateModel<T & Document>;
}

function consoleMog() {
  console.log(`
  
  __  __             
  |  \/  | ___   __ _ 
  | |\/| |/ _ \ / _ \ |
  | |  | | (_) | (_| |
  |_|  |_|\___/ \__, |
                |___/ 
                          

  `);
}

// 建立目录
function mkdirs() {
  mkdirSync(DATA_DIR, { recursive: true });
  Logger.log(chalk.blue(`数据文件夹 已准备好: ${DATA_DIR}`));

  mkdirSync(LOG_DIR, { recursive: true });
  Logger.log(chalk.blue(`日志文件夹 已准备好: ${LOG_DIR}`));

  mkdirSync(PLUGIN_DIR, { recursive: true });
  Logger.log(chalk.blue(`插件文件夹 已准备好: ${PLUGIN_DIR}`));

  mkdirSync(THEME_DIR, { recursive: true });
  mkdirSync(join(THEME_DIR, 'tmp'), { recursive: true });
  Logger.log(chalk.blue(`主题文件夹 已准备好: ${THEME_DIR}`));

  mkdirSync(PUBLIC_DIR, { recursive: true });
  Logger.log(chalk.blue(`公共文件夹 已准备好: ${PUBLIC_DIR}`));
}

export function registerGlobal() {
  $.verbose = isDev;
  Object.assign(globalThis, {
    isDev,
    consola,
  });
  console.debug = (...rest) => {
    if (isDev) {
      consola.log.call(console, ...rest);
    }
  };
}

export function register() {
  registerGlobal();
  consoleMog();
  mkdirs();
  registerStdLogger();
}
