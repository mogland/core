/*
 * @FilePath: /nx-core/src/transformers/curd.transformer.ts
 * @author: Wibus
 * @Date: 2022-07-11 14:34:44
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-11 14:34:44
 * Coding With IU
 */


export type BaseCrudModuleType<T> = {
  _model: MongooseModel<T>
}