/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

export enum ServicesEnum {
  default = 'DEFAULT',
  core = 'CORE',
  user = 'USER_SERVICE',
  auth = 'AUTH_SERVICE',
  backup = 'BACKUP_SERVICE',
  post = 'PAGE_SERVICE',
  page = 'PAGE_SERVICE',
  category = 'PAGE_SERVICE',
  friends = 'FRIENDS_SERVICE',
  comments = 'COMMENTS_SERVICE',
  config = 'CONFIG_SERVICE',
  theme = 'THEME_SERVICE',
  admin = 'ADMIN_SERVICE',
  mail = 'MAIL_SERVICE',
  notification = 'NOTIFICATION_SERVICE',
  custom = 'CUSTOM_SERVICE',
  store = 'STORE_SERVICE',
}

export enum ServicePorts {
  core = 2330,
  themes = 2303,
}
