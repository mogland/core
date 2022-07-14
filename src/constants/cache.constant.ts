/*
 * @FilePath: /nx-core/src/constants/cache.constant.ts
 * @author: Wibus
 * @Date: 2022-06-25 22:27:11
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-25 22:27:12
 * Coding With IU
 */
export enum RedisKeys {
  AccessIp = "access_ip",
  Like = "like",
  Read = "read",
  LoginRecord = "login_record",
  MaxOnlineCount = "max_online_count",
  IpInfoMap = "ip_info_map",
  LikeSite = "like_site",
  /** 后台管理入口页面缓存 */
  AdminPage = "admin_next_index_entry",
  /** 配置项缓存 */
  ConfigCache = "config_cache",
  PTYSession = "pty_session",
  /** HTTP 请求缓存 */
  HTTPCache = "http_cache",
  /** Snippet 缓存 */
  SnippetCache = "snippet_cache",

  /** 云函数缓存数据 */
  ServerlessStorage = "serverless_storage",

  JWTStore = "jwt_store",
}

export enum CacheKeys {
  AggregateCatch = "next-api-cache:aggregate_catch",
  SiteMapCatch = "next-api-cache:aggregate_sitemap_catch",
  SiteMapXmlCatch = "next-api-cache:aggregate_sitemap_xml_catch",
  RSS = "next-api-cache:rss",
  RSSXmlCatch = "next-api-cache:rss_xml_catch",
}
