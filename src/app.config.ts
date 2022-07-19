import cluster from "cluster";
import { argv } from "zx-cjs";

import { isDev } from "./utils/environment.utils";

console.log(argv);
export const PORT = argv.port || 3333;
export const CROSS_DOMAIN = {
  allowedOrigins: [
    "innei.ren",
    "shizuri.net",
    "localhost:9528",
    "localhost:2323",
    "127.0.0.1",
    "mbp.cc",
    "local.innei.test",
    "22333322.xyz",
    "localhost:3000",
  ],
  allowedReferer: "innei.ren",
};

export const MONGO_DB = {
  dbName: argv.collection_name || "nx-space",
  host: argv.db_host || "127.0.0.1",
  port: argv.db_port || 27017,
  user: argv.db_user || "",
  password: argv.db_password || "",
  userAndPassword:
    argv.db_user && argv.db_password
      ? `${argv.db_user}:${argv.db_password}@`
      : "",
  get uri() {
    return `mongodb://${this.userAndPassword}${this.host}:${this.port}${
      argv.railway ? "" : `/${this.dbName}`
    }`;
  },
};

export const REDIS = {
  host: argv.redis_host || "127.0.0.1",
  port: argv.redis_port || 6379,
  password: argv.redis_password || null,
  user: argv.redis_user || null,
  ttl: null,
  httpCacheTTL: 5,
  max: 5,
  disableApiCache:
    (isDev || argv.disable_cache) && !process.env["ENABLE_CACHE_DEBUG"],
};
export const SECURITY = {
  jwtSecret: argv.jwtSecret || "asjhczxiucipoiopiqm2376",
  jwtExpire: "7d",
};

export const DEBUG_MODE = {
  httpRequestVerbose:
    argv.httpRequestVerbose ?? argv.http_request_verbose ?? true,
};

/** Is main cluster in PM2 */
export const isMainCluster =
  process.env.NODE_APP_INSTANCE &&
  parseInt(process.env.NODE_APP_INSTANCE) === 0;
export const isMainProcess = cluster.isPrimary || isMainCluster;
