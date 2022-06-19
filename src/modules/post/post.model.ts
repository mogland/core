import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { Severity, index, modelOptions, prop, Ref } from '@typegoose/typegoose'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { BaseModel , CountMixed as Count } from '~/shared/model/base.model'
import { CategoryModel } from '../category/category.model'

@index({ slug: 1 })
@index({ modified: -1 })
@index({ text: 'text' })
@modelOptions({ options: { customName: 'Post', allowMixed: Severity.ALLOW } })
export class PostModel extends BaseModel {
  @prop({ trim: true, unique: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章路径' })
  slug!: string

  @prop({ trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章内容' })
  text: string

  @prop({ trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章标题' })
  title: string

  @prop({ trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章摘要' })
  summary: string

  @prop({ trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '文章分类' })
  categoryId: string // Ref<Category>

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
  count: number

  @prop({ 
    type: String
   })
  @IsString({ each: true })
  @IsOptional()
  @ApiProperty({ description: '文章标签' })
  tags: string[]

}
