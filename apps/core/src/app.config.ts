import cluster from 'cluster';
// import { argv } from 'zx-cjs';
import { isDev, cwd } from '@shared/global/env.global';
import { readEnv } from '~/shared/utils/read-env';
import { BasicCommer } from '@shared/commander';
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';

const argv = BasicCommer.option(
  '-a, --allow_origins <origins>',
  'allow origins 允许的域名',
)
  .parse()
  .opts();
console.log(argv, 'argv');

export const CONFIG = readEnv(ServicesEnum.core, argv, argv.config);
export const PORT = CONFIG.port || ServicePorts.core;
export const CROSS_DOMAIN = {
  allowedOrigins: CONFIG.core.allow_origins
    ? typeof CONFIG.core.allow_origins === 'string'
      ? CONFIG.core.allow_origins.split(',')
      : CONFIG.core.allow_origins
    : [
        'iucky.cn',
        'blog.iucky.cn',
        'admin.iucky.cn',
        'localhost:9528',
        'localhost:2323',
        'localhost:2222',
        '127.0.0.1',
        'localhost:3000',
      ],
  allowedReferer: 'iucky.cn',
};

export const MONGO_DB = {
  dbName: CONFIG.collection_name || 'mog',
  host: CONFIG.db_host || '127.0.0.1',
  port: CONFIG.db_port || 27017,
  user: CONFIG.db_user || '',
  password: CONFIG.db_password || '',
  userAndPassword:
    CONFIG.db_user && CONFIG.db_password
      ? `${CONFIG.db_user}:${CONFIG.db_password}@`
      : '',
  get uri() {
    return `mongodb://${this.userAndPassword}${this.host}:${this.port}${
      CONFIG.railway ? '' : `/${this.dbName}`
    }`;
  },
};

export const REDIS = {
  host: CONFIG.redis_host || '127.0.0.1',
  port: CONFIG.redis_port || 6379,
  password: CONFIG.redis_password || null,
  user: CONFIG.redis_user || null,
  ttl: null,
  httpCacheTTL: 5,
  max: 5,
  disableApiCache:
    (isDev || CONFIG.disable_cache) && !process.env['ENABLE_CACHE_DEBUG'],
};
export const SECURITY = {
  jwtSecret: CONFIG.jwt_secret || 'asjhczxiucipoiopiqm2376',
  jwtExpire: `${CONFIG.jwt_expire || 7}d`,
};

export const DEBUG_MODE = {
  httpRequestVerbose:
    CONFIG.httpRequestVerbose ?? CONFIG.http_request_verbose ?? true,
};

export const CLUSTER = {
  enable: CONFIG.cluster ?? false,
  workers: CONFIG.cluster_workers,
};

/** Is main cluster in PM2 */
export const isMainCluster =
  process.env.NODE_APP_INSTANCE &&
  parseInt(process.env.NODE_APP_INSTANCE) === 0;
export const isMainProcess = cluster.isPrimary || isMainCluster;

if (!CLUSTER.enable || cluster.isPrimary || isMainCluster) {
  console.log('cwd: ', cwd);
}
