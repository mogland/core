/*
 * @FilePath: /nx-core/shared/utils/validator/isAllowedUrl.ts
 * @author: Wibus
 * @Date: 2022-09-04 15:11:02
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-04 15:11:02
 * Coding With IU
 */
import { ValidationOptions, isURL } from 'class-validator';

import { validatorFactory } from './simpleValidatorFactory';

export const IsAllowedUrl = (validationOptions?: ValidationOptions) => {
  return validatorFactory((val) =>
    isURL(val, { require_protocol: true, require_tld: false }),
  )({
    message: '请更正为正确的网址',
    ...validationOptions,
  });
};
