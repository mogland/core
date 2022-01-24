/*
 * @FilePath: /GS-server/src/../../utils/crypt.utils.ts
 * @author: Wibus
 * @Date: 2022-01-21 23:42:36
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-23 23:45:28
 * Coding With IU
 */
import * as crypto from 'crypto';

/**
 * Encrypt password
 * @param password 密码
 * @param salt 密码盐
 */
export function encryptPassword(password: string, salt: string): string {
  if (!password || !salt) {
    return '';
  }
  const tempSalt = Buffer.from(salt, 'base64');
  return (
    // 10000 代表迭代次数 16代表长度
    crypto.pbkdf2Sync(password, tempSalt, 10000, 16, 'sha1').toString('base64')
  );
}
