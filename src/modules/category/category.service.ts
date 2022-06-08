import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '~/transformers/model.transformer';
import { PostService } from '../post/post.service';
import { CategoryModel, CategoryType } from './category.model';
import { FilterQuery } from 'mongoose'
import { PostModel } from '../post/post.model';
import { DocumentType } from '@typegoose/typegoose';
import { omit } from 'lodash'
import { CannotFindException } from '~/common/exceptions/cant-find.exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: MongooseModel<CategoryModel>,
    @Inject(forwardRef(() => PostService)) // 可以使用 forwardRef 把 PostService 暴露给 CategoryService
    private readonly postService: PostService,
  ) {
    this.createDefaultCategory() // 在初始化时创建默认分类
  }

  /**
   * 通过 categoryID 获取分类
   * @param categoryId 分类 ID
   * @returns Promise<CategoryModel>
   */
  async findCategoryById(categoryId: string) {
    const [ category, count ] = await Promise.all([
      this.categoryModel.findById(categoryId).lean(), // lean() 返回纯 JSON 对象
      this.postService.model.countDocuments({ categoryId })
    ])
    return {
       // 合并 category 和 count
      ...category,
      count
    }
  }

  /**
   * 获取所有分类
   * @returns Promise<CategoryModel[]>
   */
  async findAllCategory() {
    const data = await this.categoryModel.find({ type: CategoryType.Category }).lean() // type 用于区分分类和标签
    const counts = await Promise.all(
      data.map((item) => {
        return this.postService.model.countDocuments({ categoryId: item._id })
      })
    )
    for (let index = 0; index < data.length; index++) {
      Reflect.set(data[index], 'count', counts[index]) // Reflect 可以用于设置属性值, 参考 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
    }
    return data
  }

  /**
   * 获取所有标签
   * @returns Promise<any[]>
   */
  async getPostTagsSum() {
    const data = await this.postService.model.aggregate([ // aggregate() 方法可以按照指定的规则对数据进行操作
      { $project: { 
        tags: 1 // 只查询 tags 字段
      }}, // $project 指定要显示的字段
      {
        $unwind: '$tags', // $unwind 指定拆分数组
      },
      { $group: { _id: '$tags', count: { $sum: 1 } } }, // $group 指定分组规则
      {
        $project: {
          _id: 0, // _id 字段不显示
          name: '$_id', // name 字段显示为 _id 字段的值
          count: 1, // 显示 count 字段
        },
      },
    ])
    return data
  }

  /**
   * 用标签查找文章
   * @param tag 标签名
   * @param conditions 查询条件
   * @returns Promise<null | any[]>
   */
  async findPostWithTag (
    tag: string,
    conditions: FilterQuery<DocumentType<PostModel>> = {},
  ): Promise<null | any[]> {
    const posts = await this.postService.model.find({
      tags: tag,
      ...conditions,
    }, undefined, { lean: true }).populate('category')

    if (!posts.length) throw new CannotFindException()

    return posts.map(({ _id, title, slug, category, created }) => ({
      _id,
      title,
      slug,
      category: omit(category, ['count', '__v', 'created', 'modified']),
      created,
    }))
  }

  /**
   * 用分类Id查找文章
   * @param categoryId 分类 ID
   * @param condition 查询条件
   * @returns Promise<any[]>
   */
  async findCategoryPost(categoryId: string, condition: any = {}) {
    return await this.postService.model
      .find({
        categoryId,
        ...condition,
      })
      .select('title created slug _id') // select() 方法可以指定要显示的字段, 选择标题、创建时间、slug、_id
      .sort({ created: -1 }) // sort() 方法可以指定排序规则，-1 表示倒序
  }

  /**
   * 查找文章的分类
   * @param categoryId 分类 ID
   * @returns Promise<PostModel>
   */
  async findPostsInCategory(categoryId: string) {
    return await this.postService.model.find({ categoryId })
  }

  /**
   * 创建默认分类
   * @returns Promise<CategoryModel[]>
   */
  async createDefaultCategory() {
    // 若已存在默认分类，则不创建
    if ((await this.categoryModel.countDocuments()) === 0) { // 此处 countDocuments() 返回集合中文档的数量
      return await this.categoryModel.create({
        name: '默认分类',
        slug: 'default',
      })
    }
  }
}
