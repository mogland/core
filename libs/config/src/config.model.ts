import { Schema } from 'mongoose';

import { Severity, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  options: { allowMixed: Severity.ALLOW, customName: 'Option' },
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

  @prop({ type: Schema.Types.Mixed })
  value: any;

  // @prop({ type: Boolean, default: false })
  // auth: boolean;
}
