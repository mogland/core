import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { PostModel } from './post.model'
import { InjectModel } from '~/transformers/model.transformer'
import { FilterQuery, PaginateOptions } from 'mongoose'
import { CategoryService } from '../category/category.service'
import { ReturnModelType } from '@typegoose/typegoose'

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel) 
    private readonly postModel: ReturnModelType<typeof PostModel>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
  ) {}
  get model(){
    return this.postModel
  }

  /**
   * 带分页的查询
   * @param conditions 查询条件
   * @param options 分页参数
   * @returns Promise<PostModel[]>
   */
  findWithPaginator(
    conditions: FilterQuery<PostModel>,
    options: PaginateOptions,
  ) {
    return this.postModel.paginate(conditions as any, options)
  }

  /**
   * 创建新文章
   * @param post 文章
   * @returns Promise<PostModel>
   */
  async create(post: PostModel) {
    const { categoryId } = post
    // const category = await this.categoryService
    return await this.postModel.create(post)
  }
}
