import { ValidationOptions } from 'class-validator';
import { validatorFactory } from './simpleValidatorFactory';
import merge from 'lodash/merge';
import { CronJob } from 'cron';

export function IsCron(validationOptions?: ValidationOptions) {

  return validatorFactory((value) => {
    try {
      new CronJob(value, () => {});
      return true
    } catch {
      return false
    }
  })(
    merge<ValidationOptions, ValidationOptions>(validationOptions || {}, {
      message: '必须为 Cron 表达式',
    }),
  );
}
