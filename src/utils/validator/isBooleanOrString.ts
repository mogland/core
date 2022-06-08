/*
 * @FilePath: /nx-core/src/utils/validator/isBooleanOrString.ts
 * @Author: Innei
 * @Date: 2022-06-08 14:40:06
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-08 14:40:06
 * Coding With IU
 */
import { ValidationOptions } from 'class-validator'
import { isString } from 'class-validator'
import { isBoolean, merge } from 'lodash'

import { validatorFactory } from './simpleValidatorFactory'

export function IsBooleanOrString(validationOptions?: ValidationOptions) {
  return validatorFactory((value) => isBoolean(value) || isString(value))(
    merge<ValidationOptions, ValidationOptions>(validationOptions || {}, {
      message: '类型必须为 String or Boolean',
    }),
  )
}
