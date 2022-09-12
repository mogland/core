/*
 * @FilePath: /nx-core/shared/utils/validator/isNilOrString.ts
 * @author: Wibus
 * @Date: 2022-08-31 20:43:41
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-31 20:45:37
 * Coding With IU
 */

import {
  registerDecorator,
  // ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';

class IsNilOrStringConstraint implements ValidatorConstraintInterface {
  validate(
    value: any,
    // args: ValidationArguments
  ) {
    return isNil(value) || isString(value);
  }
}

export function IsNilOrString(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNilOrStringConstraint,
    });
  };
}
