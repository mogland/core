/*
 * @FilePath: /mog-core/shared/transformers/curd.transformer.ts
 * @author: Wibus
 * @Date: 2022-07-11 14:34:44
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-11 13:37:48
 * Coding With IU
 */

import { ModelType } from '@typegoose/typegoose/lib/types';
import { PaginateModel } from 'mongoose';

export type BaseCrudModuleType<T> = {
  _model: ModelType<T> & PaginateModel<T & Document>;
};
