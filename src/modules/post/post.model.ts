import { UnprocessableEntityException } from '@nestjs/common'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Severity, index, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { Transform } from 'class-transformer'
import { IsDate, isDateString, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator'
import { CountMixed as Count, WriteBaseModel } from '~/shared/model/base.model'
import { CategoryModel } from '../category/category.model'

@index({ slug: 1 })
@index({ modified: -1 })
@index({ text: 'text' })
@modelOptions({ options: { customName: 'Post', allowMixed: Severity.ALLOW } })
export class PostModel extends WriteBaseModel {
  @prop({ trim: true, unique: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章路径' })
  slug!: string

  @prop({ trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章摘要' })
  summary: string

  @prop({ trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章分类' })
  categoryId: Ref<CategoryModel>

  @prop({
    ref: () => CategoryModel,
    foreignField: '_id',
    localField: 'categoryId',
    justOne: true,
  })
  @ApiHideProperty()
  public category: Ref<CategoryModel>

  @prop({ trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章署名' })
  copyright: string

  @prop({ 
    type: Count
   })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章阅读数' })
  view: number

  @prop()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'undefined') {
      return value
    }
    const isDateIsoString = isDateString(value)
    if (isDateIsoString) {
      return new Date(value)
    }
    if (typeof value != 'boolean') {
      throw new UnprocessableEntityException('pin value must be boolean')
    }

    if (value === true) {
      return new Date()
    } else {
      return null
    }
  })
  @ApiProperty({ description: '文章置顶' })
  pin?: Date | null

  @prop()
  @Min(0)
  @IsInt()
  @IsOptional()
  @Transform(({ obj, value }) => {
    if (!obj.pin) {
      return null
    }
    return value
  })
  @ApiProperty({ description: '文章置顶优先级' })
  pinOrder?: number

  @prop({ 
    type: String
   })
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ description: '文章标签' })
  tags: string[]

  @prop({
    type: Date,
    default: Date.now,
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章创建时间' })
  created: Date

  @prop({
    type: Date,
  })
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '文章修改时间' })
  modified: Date

}
