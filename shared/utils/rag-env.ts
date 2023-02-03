/*
 * @FilePath: /mog-core/shared/utils/rag-env.ts
 * @author: Wibus
 * @Date: 2022-11-15 22:57:49
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-18 11:56:14
 * Coding With IU
 */

import { join } from 'path';
import { cwd } from 'shared/global/env.global';
import { argv as zxArev, YAML } from 'zx-cjs';
import { camelToUnderline } from './name';
import { ServicesEnum } from '../constants/services.constant';
import { readFileSync } from 'fs';
import { merge } from 'lodash';

// node dist/apps/core/main.js \
// 	--userService_host=192.168.101.2 \
// 	--pageService_host=192.168.101.3 \
// 	--core_port=8888 \
// 	--core_allow_origins=example.com,excccc.com

// # 或者是使用 YAML 格式的配置文件

// node dist/apps/core/main.js \
//   --config=core.yml

export const readEnv: (
  argv: typeof zxArev,
  path?: string,
) => {
  [key: string]: any;
} = (argv, path) => {
  let config = {};
  delete argv._; // 删除无用的参数
  delete argv.config; // 删除 config 参数，这是用来指定配置文件的
  config = merge(config, argv);

  const envPath = path || join(cwd, 'env.yaml');
  let env: string;
  try {
    env = readFileSync(envPath, 'utf-8');
  } catch (error) {
    return config;
  }
  if (!env!) return config;
  const envObj = YAML.parse(env);
  // 与 config 合并
  config = merge(config, envObj);

  if (!process.env.MOG_PRIVATE_ENV)
    process.env.MOG_PRIVATE_ENV = JSON.stringify(config);

  return config;
};

export const getEnv = (service?: ServicesEnum) => {
  if (!process.env.MOG_PRIVATE_ENV) return {};
  const env = JSON.parse(process.env.MOG_PRIVATE_ENV);
  if (!service) return env;
  return env[camelToUnderline(service.toLocaleLowerCase())];
};
