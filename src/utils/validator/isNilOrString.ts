/*
 * @FilePath: /nx-core/src/utils/validator/isNilOrString.ts
 * @author: Wibus
 * @Date: 2022-07-03 09:27:13
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-03 09:29:39
 * Coding With IU
 */

import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { isNil, isString } from "lodash";

class IsNilOrStringConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    return isNil(value) || isString(value);
  }
}

export function IsNilOrString(validationOptions?: ValidationOptions){
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNilOrStringConstraint
    });
  }
}