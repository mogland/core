/*
 * @FilePath: /nx-core/src/utils/validator/isBooleanOrString.ts
 * @Author: Innei
 * @Date: 2022-06-08 14:40:06
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-14 16:24:58
 * Coding With IU
 */
import { ValidationOptions, isString } from "class-validator";
import { isBoolean, merge } from "lodash";

import { validatorFactory } from "./simpleValidatorFactory";

export function IsBooleanOrString(validationOptions?: ValidationOptions) {
  return validatorFactory((value) => isBoolean(value) || isString(value))(
    merge<ValidationOptions, ValidationOptions>(validationOptions || {}, {
      message: "类型必须为 String or Boolean",
    })
  );
}
