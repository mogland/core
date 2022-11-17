/*
 * @FilePath: /mog-core/shared/utils/name.ts
 * @author: Wibus
 * @Date: 2022-11-17 12:37:19
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-17 12:39:46
 * Coding With IU
 */

// 驼峰转下划线
export const camelToUnderline = (str: any) => {
  if (typeof str === 'object') {
    const obj = {};
    for (const key in str) {
      obj[camelToUnderline(key)] = str[key];
    }
    return obj;
  }
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

// 下划线转驼峰
export const underlineToCamel = (str: any) => {
  if (typeof str === 'object') {
    const obj = {};
    for (const key in str) {
      obj[underlineToCamel(key)] = str[key];
    }
    return obj;
  }
  return str.replace(/_([a-z])/g, (all: any, letter: string) =>
    letter.toUpperCase(),
  );
};
