import { homedir } from "os";
import { join } from "path";
import { isDev } from "../global/env.global";
const appName = "nx-space";
export const HOME = homedir();
export const DATA_DIR = isDev
  ? join(process.cwd(), "./tmp")
  : join(HOME, `.${appName}`);
export const PLUGIN_DIR = join(DATA_DIR, "plugins");
export const LOG_DIR = join(DATA_DIR, "log");
export const BACKUP_DIR = join(DATA_DIR, "backup");
export const THEME_DIR = join(DATA_DIR, "themes");
