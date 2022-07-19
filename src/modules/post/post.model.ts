import { UnprocessableEntityException } from "@nestjs/common";
import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import {
  Severity,
  index,
  modelOptions,
  prop,
  Ref,
  DocumentType,
  pre,
  plugin,
} from "@typegoose/typegoose";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsDate,
  isDateString,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { CountMixed as Count, WriteBaseModel } from "~/shared/model/base.model";
import { CategoryModel } from "../category/category.model";
import { BeAnObject } from "@typegoose/typegoose/lib/types";
import { Query } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IsNilOrString } from "~/utils/validator/isNilOrString";

@plugin(aggregatePaginate)
@pre<PostModel>("findOne", autoPopulateCategory)
@pre<PostModel>("find", autoPopulateCategory)
@index({ slug: 1 })
@index({ modified: -1 })
@index({ text: "text" })
@modelOptions({ options: { customName: "Post", allowMixed: Severity.ALLOW } })
export class PostModel extends WriteBaseModel {
  @prop({ trim: true, unique: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "文章路径" })
  slug!: string;

  @prop({ trim: true, required: true })
  @IsString()
  @ApiProperty({ description: "文章摘要" })
  summary?: string;

  @prop({ ref: () => CategoryModel, required: true })
  @IsMongoId()
  @ApiProperty({ example: "5eb2c62a613a5ab0642f1f7a" })
  @ApiProperty({ description: "文章分类" })
  categoryId: Ref<CategoryModel>;

  @prop({
    ref: () => CategoryModel,
    foreignField: "_id",
    localField: "categoryId",
    justOne: true,
  })
  @ApiHideProperty()
  public category: Ref<CategoryModel>;

  @prop()
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: "文章署名" })
  copyright?: boolean;

  @prop({
    type: Count,
  })
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: "文章阅读数" })
  view?: number;

  @prop()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "undefined") {
      return value;
    }
    const isDateIsoString = isDateString(value);
    if (isDateIsoString) {
      return new Date(value);
    }
    if (typeof value != "boolean") {
      throw new UnprocessableEntityException("pin value must be boolean");
    }

    if (value === true) {
      return new Date();
    } else {
      return null;
    }
  })
  @ApiProperty({ description: "文章pin日期" })
  pin?: Date | null;

  @prop()
  @Min(0)
  @IsInt()
  @IsOptional()
  @Transform(({ obj, value }) => {
    if (!obj.pin) {
      return null;
    }
    return value;
  })
  @ApiProperty({ description: "文章置顶优先级" })
  pinOrder?: number;

  @prop({
    type: String,
  })
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ description: "文章标签" })
  tags?: string[];

  @prop({
    type: Date,
    default: Date.now,
  })
  @IsString()
  @IsOptional()
  @ApiProperty({ description: "文章创建时间" })
  created?: Date;

  @prop({
    type: Date,
  })
  @IsString()
  @IsOptional()
  @ApiProperty({ description: "文章修改时间" })
  modified?: Date;

  @prop({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: "文章是否隐藏" })
  hide?: boolean;

  @prop({ type: String, default: null })
  @IsOptional()
  @IsNilOrString()
  @ApiProperty({ description: "文章加密密码（若填写则启动加密）" })
  password?: string | null;

  @prop({ type: Boolean, default: true })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: "文章是否公开在RSS输出" })
  rss?: boolean;
}

function autoPopulateCategory(
  this: Query<
    any,
    DocumentType<PostModel, BeAnObject>,
    {},
    DocumentType<PostModel, BeAnObject>
  >,
  next: () => void
) {
  this.populate({ path: "category" });
  next();
}
