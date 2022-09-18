/*
 * @FilePath: /nx-core/apps/page-service/src/category.service.ts
 * @author: Wibus
 * @Date: 2022-09-18 15:00:16
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-18 15:00:16
 * Coding With IU
 */
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { nextTick } from 'process';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { CategoryModel } from './model/category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: ReturnModelType<typeof CategoryModel>,
  ) {}

  get category() {
    return this.categoryModel;
  }

  async getCategoryById(categoryId: string) {
    return this.categoryModel.findById(categoryId).lean();
  }

  async getCategoryBySlug(slug: string) {
    return this.categoryModel.findOne({ slug }).lean();
  }

  async getCategories() {
    return this.categoryModel.find().lean();
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
    const action = this.categoryModel.findByIdAndDelete(categoryId);
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
