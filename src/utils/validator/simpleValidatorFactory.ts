/*
 * @FilePath: /nx-core/src/utils/validator/simpleValidatorFactory.ts
 * @Author: Innei
 * @Date: 2022-06-08 14:40:27
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-08 14:40:28
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
