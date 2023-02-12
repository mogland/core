/*
 * @FilePath: /nx-core/apps/page-service/src/category.service.ts
 * @author: Wibus
 * @Date: 2022-09-18 15:00:16
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 15:36:36
 * Coding With IU
 */
import { Inject, Injectable } from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { FilterQuery } from 'mongoose';
import { nextTick } from 'process';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { BadRequestRpcExcption } from '~/shared/Exceptions/bad-request-rpc-exception';
import { NotFoundRpcExcption } from '~/shared/Exceptions/not-found-rpc-exception';
import { MultiCategoriesQueryDto } from './dto/category.dto';
import { CategoryModel, CategoryType } from './model/category.model';
import { PostModel } from './model/post.model';
import { PostService } from './post-service.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: ReturnModelType<typeof CategoryModel>,
    @Inject(PostService)
    private readonly postService: PostService,
  ) {}

  get model() {
    return this.categoryModel;
  }

  async multiGetCategories(query: MultiCategoriesQueryDto) {
    const {
      ids, // 分类id列表,c ategories is category's mongo id
      joint, // 是否连接分类与文章
      type = CategoryType.Category, // 分类类型
    } = query;

    if (ids) {
      // 获取指定分类
      const ignores = '-text -summary -hide -images -commentsIndex'; // 忽略的字段, -表示忽略
      const obj = new Object();
      if (joint) {
        // 连接分类与文章
        await Promise.all(
          ids.map(async (id) => {
            const data = await this.postService.model
              .find({ categoryId: id }, ignores)
              .sort({ createdAt: -1 }) // sort 和 populate 的区别：sort是排序，populate是关联
              .lean();

            obj[id] = data; // 将文章数据添加到对象中
            return id;
          }),
        );

        return { entries: obj }; // 分类与文章列表
      } else {
        await Promise.all(
          ids.map(async (id) => {
            const posts = await this.postService.model
              .find({ categoryId: id }, ignores)
              .sort({ created: -1 })
              .lean();
            const category = await this.getCategoryById(id);
            obj[id] = Object.assign({ ...category, children: posts });
            return id;
          }),
        );

        return { entries: obj };
      }
    }
    return type === CategoryType.Category
      ? await this.getAllCategories()
      : await this.getPostTagsSum();
  }

  async getCategoryById(categoryId: string) {
    const [category, count] = await Promise.all([
      this.categoryModel.findById(categoryId).lean(), // lean() 返回纯 JSON 对象
      this.postService.model.countDocuments({ categoryId }),
    ]);
    return {
      ...category,
      count,
    };
  }

  async getCategoryBySlug(slug: string) {
    return this.categoryModel.findOne({ slug }).lean();
  }

  async getAllCategories() {
    const data = await this.categoryModel
      .find({ type: CategoryType.Category })
      .lean(); // type 用于区分分类和标签
    const counts = await Promise.all(
      data.map((item) => {
        return this.postService.model.countDocuments({ categoryId: item._id });
      }),
    );
    for (let index = 0; index < data.length; index++) {
      Reflect.set(data[index], 'count', counts[index]); // Reflect 可以用于设置属性值, 参考 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect
    }
    return data;
  }

  /**
   * 获取所有标签
   * @returns Promise<any[]>
   */
  async getPostTagsSum() {
    const data = await this.postService.model.aggregate([
      // aggregate() 方法可以按照指定的规则对数据进行操作
      {
        $project: {
          tags: 1, // 只查询 tags 字段
        },
      }, // $project 指定要显示的字段
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
    ]);
    return data;
  }

  /**
   * 用标签查找文章
   * @param tag 标签名
   * @param conditions 查询条件
   * @returns Promise<null | any[]>
   */
  async findPostWithTag(
    tag: string,
    conditions: FilterQuery<DocumentType<PostModel>> = {},
  ): Promise<null | any[]> {
    const posts = await this.postService.model
      .find(
        {
          tags: tag,
          ...conditions,
        },
        undefined,
        { lean: true },
      )
      .populate('category');

    if (!posts.length)
      throw new NotFoundRpcExcption(ExceptionMessage.PageIsNotExist);

    return posts;
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
        condition,
      })
      // .select("title created slug _id")
      .sort({ created: -1 });
  }

  /**
   * 查找分类的文章
   * @param categoryId 分类 ID
   * @returns Promise<PostModel>
   */
  async findPostsInCategory(categoryId: string) {
    return await this.postService.model.find({ categoryId });
  }

  /**
   * mergeTag 合并标签
   * @param from 标签名
   * @param to 目标标签名
   */
  async mergeTag(from: string, to: string) {
    const posts = await this.postService.model.find({ tags: from }); // 查找所有包含 from 标签的文章
    for (const post of posts) {
      const tags = post.tags?.filter((tag) => tag !== from); // 删除 from 标签
      if (tags?.includes(to)) {
        await post.updateOne({ tags });
        continue;
      } // 如果 tags 中已经包含 to 标签, 则跳过
      tags?.push(to); // 将 to 标签添加到 tags 数组中
      await post.updateOne({ tags }); // 更新文章的 tags 字段
    }
  }

  /**
   * 合并分类
   * @param from 分类名
   * @param to 目标分类名
   */
  async mergeCategory(from: string, to: string) {
    const posts = await this.postService.model.find({ categoryId: from }); // 查找所有包含 from 分类的文章
    for (const post of posts) {
      await post.updateOne({ categoryId: to }); // 更新文章的 category 字段
    }
    return 1;
  }

  async createCategory(data: any) {
    return this.categoryModel.create(data);
  }

  async updateCategory(categoryId: string, data: any) {
    return this.categoryModel.findByIdAndUpdate(categoryId, data, {
      new: true, // return updated document
    });
  }

  async deleteCategory(categoryId: string) {
    const category = await this.model.findById(categoryId);
    if (!category) {
      throw new NotFoundRpcExcption(ExceptionMessage.CategoryIsNotExist);
    }
    const postsInCategory = await this.findPostsInCategory(category.id);
    if (postsInCategory.length > 0) {
      throw new BadRequestRpcExcption(ExceptionMessage.CategoryHasPost);
    }
    const action = this.categoryModel.deleteOne({
      _id: categoryId,
    });
    nextTick(async () => {
      const count = await this.categoryModel.countDocuments();
      if (!count) {
        await this.categoryModel.create({
          name: '默认分类',
          slug: 'default',
        });
      }
    });
    return action;
  }
}
