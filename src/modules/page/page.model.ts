/*
 * @FilePath: /nx-core/src/modules/page/page.model.ts
 * @author: Wibus
 * @Date: 2022-07-03 09:16:33
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-03 09:33:47
 * Coding With IU
 */

import { PartialType } from "@nestjs/swagger";
import { modelOptions, prop } from "@typegoose/typegoose";
import { Transform } from "class-transformer";
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { WriteBaseModel } from "~/shared/model/base.model";
import { IsNilOrString } from "~/utils/validator/isNilOrString";

@modelOptions({
  options: {
    customName: "page",
  }
})
export class PageModel extends WriteBaseModel {
  @prop({ required: true, unique: true, trim: 1, index: true })
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @prop({ trim: 1, type: String })
  @IsString()
  @IsOptional()
  @IsNilOrString()
  subtitle?: string | null;

  @prop({ default: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(( { value } ) => parseInt(value))
  order!: number;
}

export class PartialPageModel extends PartialType(PageModel){}