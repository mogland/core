/*
 * @FilePath: /nx-core/src/shared/model/image.model.ts
 * @author: Wibus
 * @Date: 2022-07-19 13:37:10
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-19 14:03:52
 * Coding With IU
 */

import {
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: { _id: false },
})
export abstract class ImageModel {
  @prop()
  @IsOptional()
  @IsNumber()
  width?: number;

  @prop()
  @IsOptional()
  @IsNumber()
  height?: number;

  @prop()
  @IsOptional()
  @IsHexColor()
  color?: string;

  @prop()
  @IsString()
  @IsOptional()
  type?: string;

  @prop()
  @IsOptional()
  @IsUrl()
  src?: string;
}
