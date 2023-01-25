// @ts-nocheck
/**
 * WARNING: 此方法无法在模板中使用
 */
export const ThemeI18nUtil = {
  name: '_i',
  _i: (key: string) => {
    const YAML = require('zx-cjs').YAML;
    try {
      const theme =
        JSON.parse(process.env.MOG_PRIVATE_INNER_ENV || '{}')?.theme ||
        undefined;
      const langFile = YAML.parse(
        fs.readFileSync(path.join(THEME_DIR, theme, 'i18n.yaml'), 'utf-8'),
      );
      const lang = YAML.parse(
        fs.readFileSync(path.join(THEME_DIR, theme, 'config.yaml'), 'utf-8'),
      ).language;
      return langFile[lang][key];
    } catch (e) {
      console.log(e);
      return key;
    }
  },
};
