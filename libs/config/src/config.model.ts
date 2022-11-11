import mongoose from 'mongoose';

import { Severity, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  options: { customName: 'Option', allowMixed: Severity.ALLOW },
  schemaOptions: {
    timestamps: {
      createdAt: false,
      updatedAt: false,
    },
  },
})
export class ConfigModel {
  @prop({ unique: true, required: true })
  name: string;

  @prop({ type: mongoose.Schema.Types.Mixed })
  value: any;

  // @prop({ type: Boolean, default: false })
  // auth: boolean;
}
