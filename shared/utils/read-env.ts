/*
 * @FilePath: /mog-core/shared/utils/read-env.ts
 * @author: Wibus
 * @Date: 2022-11-15 22:57:49
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-17 13:33:33
 * Coding With IU
 */

import { join } from 'path';
import { cwd } from 'shared/global/env.global';
import { argv as zxArev } from 'zx-cjs';
import yaml from 'js-yaml';
import { readFile } from 'fs/promises';
import { camelToUnderline } from './name';

// node dist/apps/core/main.js \
// 	--userService_host=192.168.101.2 \
// 	--pageService_host=192.168.101.3 \
// 	--core_port=8888 \
// 	--core_allow_origins=example.com,excccc.com

// # 或者是使用 YAML 格式的配置文件

// node dist/apps/core/main.js \
//   --config=core.yml

export const readEnv = async (argv: typeof zxArev, path?: string) => {
  const config = {};
  delete argv._; // 删除无用的参数
  delete argv.config; // 删除 config 参数，这是用来指定配置文件的
  if (!(Object.keys(argv).length === 0 && argv.constructor === Object)) {
    for (const key in argv) {
      const [service, ...keyName] = key.split('_');
      if (service && keyName) {
        if (!config[camelToUnderline(service)])
          config[camelToUnderline(service)] = {};
        config[camelToUnderline(service)][keyName.join('_')] = argv[key];
      }
    }
  } else {
    const envPath = path || join(cwd, '.env.yaml');
    const env = (await readFile(envPath, 'utf-8').then((data) => {
      if (!data) return {};
      return yaml.load(data);
    })) as Record<string, any>;
    Object.assign(config, camelToUnderline(env));
  }
  console.log(config);
  return config;
};
