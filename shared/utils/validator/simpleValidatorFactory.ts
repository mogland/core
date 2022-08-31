/*
 * @FilePath: /nx-core/shared/utils/validator/simpleValidatorFactory.ts
 * @author: Wibus
 * @Date: 2022-08-31 20:43:35
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-31 20:43:36
 * Coding With IU
 */

import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  registerDecorator,
} from "class-validator";

export function validatorFactory(validator: (value: any) => boolean) {
  @ValidatorConstraint({ async: true })
  class IsBooleanOrStringConstraint implements ValidatorConstraintInterface {
    validate(value: any, _args: ValidationArguments) {
      return validator.call(this, value);
    }
  }

  return function (validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsBooleanOrStringConstraint,
      });
    };
  };
}
