import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from "@nestjs/common";
import { PostModel } from "./post.model";
import { InjectModel } from "~/transformers/model.transformer";
import { FilterQuery, PaginateOptions } from "mongoose";
import { CategoryService } from "../category/category.service";
import slugify from "slugify";
import { isDefined } from "class-validator";
import { omit } from "lodash";
import { BusinessException } from "~/common/exceptions/business.excpetion";
import { ErrorCodeEnum } from "~/constants/error-code.constant";

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel)
    private readonly postModel: MongooseModel<PostModel>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService
  ) {}
  get model() {
    return this.postModel;
  }

  /**
   * 带分页的查询
   * @param conditions 查询条件
   * @param options 分页参数
   * @returns Promise<PostModel[]>
   */
  findWithPaginator(
    conditions: FilterQuery<PostModel>,
    options: PaginateOptions
  ) {
    return this.postModel.paginate(conditions as any, options);
  }

  /**
   * 创建新文章
   * @param post 文章
   * @returns Promise<PostModel>
   */
  async create(post: PostModel) {
    const { categoryId } = post;
    const category = await this.categoryService.findCategoryById(
      categoryId as any as string
    );
    if (!category) {
      throw new BadRequestException("分类不存在o(╯□╰)o");
    }

    const slug = post.slug ? slugify(post.slug) : slugify(post.title);
    const isAvailableSlug = await this.isAvailableSlug(slug);
    if (!isAvailableSlug) {
      throw new BusinessException(ErrorCodeEnum.SlugNotAvailable);
    }
    const res = await this.postModel.create({
      ...post,
      slug,
      categoryId: category.id,
      created: new Date(),
      modified: null,
    });
    return res;
  }

  /**
   * 更新文章
   * @param id 文章id
   * @param data 文章数据
   * @returns Promise<PostModel>
   */
  async updateById(id: string, data: Partial<PostModel>) {
    const oldDocument = await this.postModel.findById(id).lean();
    if (!oldDocument) {
      throw new BadRequestException("文章不存在o(╯□╰)o");
    }
    const { categoryId } = data;
    if (categoryId && categoryId !== oldDocument.categoryId) {
      const category = await this.categoryService.findCategoryById(
        categoryId as any as string
      );
      if (!category) {
        throw new BadRequestException("分类不存在o(╯□╰)o");
      }
    }
    if ([data.text, data.title, data.slug].some((i) => isDefined(i))) {
      const now = new Date();

      data.modified = now;
    }

    const originDocument = await this.postModel.findById(id);
    if (!originDocument) {
      throw new BadRequestException();
    }
    if (data.slug && data.slug !== originDocument.slug) {
      data.slug = slugify(data.slug);
      // 检查slug是否已存在
      const isAvailableSlug = await this.isAvailableSlug(data.slug);
      if (!isAvailableSlug) {
        throw new BusinessException(ErrorCodeEnum.SlugNotAvailable);
      }
    }
    Object.assign(originDocument, omit(data, PostModel.protectedKeys));
    await originDocument.save();
    return originDocument.toObject();
  }

  /**
   * 根据id删除文章
   * @param id 文章id
   * @returns void
   **/
  async deletePost(id: string) {
    await Promise.all([
      this.model.deleteOne({ _id: id }),
      // this.commentModel.deleteMany({ ref: id, refType: CommentRefTypes.Post }),
    ]);
  }

  /**
   * 根据id查询文章
   * @param slug 文章slug
   * @returns Promise<CategoryModel>
   */
  async getCategoryBySlug(slug: string) {
    return await this.categoryService.model.findOne({ slug });
  }

  /**
   * 查询slug是否可用
   * @param slug 文章slug
   * @returns Promise<boolean>
   */
  async isAvailableSlug(slug: string) {
    return (await this.postModel.countDocuments({ slug })) === 0;
  }
}
