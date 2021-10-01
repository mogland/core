/*
 * @FilePath: /nest-server/core/schemas/host.schema.ts
 * @author: Wibus
 * @Date: 2021-10-01 05:21:41
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-01 05:54:55
 * Coding With IU
 */
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const hostSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});

export class Host extends Document {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}
