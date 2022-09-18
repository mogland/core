import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { CategoryModel } from './category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: ReturnModelType<typeof CategoryModel>,
  ) {}

  get model() {
    return this.categoryModel;
  }

  /**
   * 通过 categoryID 获取分类
   * @param id 分类 ID
   */
  async findCategoryById(id: string) {
    return this.categoryModel.findById(id).lean();
  }
}
