/*
 * @FilePath: /nx-core/shared/utils/validator/isBooleanOrString.ts
 * @author: Wibus
 * @Date: 2022-08-31 20:42:58
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-31 20:45:56
 * Coding With IU
 */
import { ValidationOptions, isString } from "class-validator";
import isBoolean from "lodash-es/isBoolean";
import merge from "lodash-es/merge";


import { validatorFactory } from "./simpleValidatorFactory";

export function IsBooleanOrString(validationOptions?: ValidationOptions) {
  return validatorFactory((value) => isBoolean(value) || isString(value))(
    merge<ValidationOptions, ValidationOptions>(validationOptions || {}, {
      message: "类型必须为 String or Boolean",
    })
  );
}
