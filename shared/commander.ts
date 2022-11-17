/*
 * @FilePath: /mog-core/shared/commander.ts
 * @author: Wibus
 * @Date: 2022-11-17 13:43:30
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-17 14:20:26
 * Coding With IU
 */

import { program } from 'commander';

export const BasicCommer = program
  .option('-c, --config <path>', 'config file path 配置文件路径')
  .option('-p, --port <port>', 'port to listen on 启动端口')

  .option('-N, --collection_name <name>', 'collection name 数据库集合名')
  .option('-H, --db_host <host>', 'host of database 数据库地址')
  .option('-U, --db_user <user>', 'user of database 数据库用户名')
  .option('-P, --db_password <password>', 'password of database 数据库密码')

  .option('-RH, --redis_host <host>', 'host of redis redis地址')
  .option('-RP, --redis_port <port>', 'port of redis redis端口')
  .option('-RPW, --redis_password <password>', 'password of redis redis密码')
  .option('-RPW, --redis_user <user>', 'user of redis redis用户名')
  .option('--disable_cache', 'disable cache 禁用缓存')

  .option('--jwtSecret <secret>', 'jwt secret jwt密钥')
  .option(
    '--jwt_expire <number>',
    'custom jwt expire time(d) 自定义jwt过期时间(天)',
  );

// .option('-a, --allow_origins <origins>', 'allow origins 允许的域名')
// .option('--host <host>', 'host of core 核心Core服务地址 ( 其他服务使用 )')
