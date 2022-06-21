/*
 * @FilePath: /nx-core/src/modules/configs/configs.model.ts
 * @author: Wibus
 * @Date: 2022-06-22 07:39:48
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-22 07:53:13
 * Coding With IU
 */

import { modelOptions, prop, Severity } from "@typegoose/typegoose";
import { Schema } from 'mongoose';

@modelOptions({
  options: { allowMixed: Severity.ALLOW, customName: 'Configs' },
})
export class ConfigsModel {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ type: Schema.Types.Mixed }) // 不需要必填
  value: any;
}