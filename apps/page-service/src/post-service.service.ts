import slugify from 'slugify';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  AggregatePaginateModel,
  Document,
  PaginateModel,
  PipelineStage,
} from 'mongoose';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { PagerDto } from '~/shared/dto/pager.dto';
import { addYearCondition } from '~/shared/transformers/db-query.transformer';
import { CategoryService } from './category.service';
import { PostModel } from './model/post.model';
import { isDefined } from 'class-validator';
import { omit } from 'lodash';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { NotificationEvents } from '~/shared/constants/event.constant';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(PostModel)
    private readonly postModel: ModelType<PostModel> &
      PaginateModel<PostModel & Document> &
      AggregatePaginateModel<PostModel & Document>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    @Inject(ServicesEnum.notification)
    private readonly notification: ClientProxy,
  ) {}

  get model() {
    return this.postModel;
  }

  async aggregatePaginate(query: PagerDto, isMaster: boolean) {
    if (!isMaster) isMaster = false;
    const { size, select, page, year, sortBy, sortOrder } = query;
    return this.model.aggregatePaginate(
      this.model.aggregate(
        [
          {
            $match: {
              ...addYearCondition(year),
            },
          },
          // @see https://stackoverflow.com/questions/54810712/mongodb-sort-by-field-a-if-field-b-null-otherwise-sort-by-field-c
          // {
          //   $addFields: {
          //     sortField: {
          //       // 创建一个新的字段，用于排序
          //       $cond: {
          //         // 根据条件赋值
          //         if: { $ne: ["$pin", null] }, // 如果pin不为空
          //         then: "$pinOrder", // 如果pin不为空，按照pinOrder排序
          //         else: "$$REMOVE", // 如果pin为空，移除该字段
          //       },
          //     },
          //   },
          // },
          // if not master, only show published posts
          !isMaster && {
            $match: {
              // match the condition
              hide: { $ne: true }, // $ne: not equal
            },
          },
          // 如果不是master，并且password不为空，则将text,summary修改
          !isMaster && {
            $set: {
              // set the field to a new value
              summary: {
                $cond: {
                  if: { $ne: ['$password', null] }, // if "password" is not null
                  then: { $concat: ['内容已被隐藏，请输入密码'] }, // then the value of "内容已被隐藏"
                  else: '$title', // otherwise, use the original title
                }, // $concat: 用于拼接字符串
              },
              text: {
                $cond: {
                  // 如果密码字段不为空，且isMaster为false，则不显示
                  if: {
                    $ne: ['$password', null],
                  }, // whether "b" is not null
                  then: { $concat: ['内容已被隐藏，请输入密码'] },
                  else: '$text',
                },
              },
            },
          },
          !isMaster && {
            // if not master, only show usual fields
            $project: {
              hide: 0,
              password: 0,
              rss: 0,
            },
          },
          {
            $sort: sortBy
              ? {
                  [sortBy]: sortOrder as any,
                }
              : {
                  sortField: -1, // sort by our computed field
                  pin: -1,
                  created: -1, // and then by the "created" field
                },
          },
          {
            $project: {
              // project the fields we want to keep
              sortField: 0, // remove "sort" field if needed
            },
          },
          select && {
            $project: {
              ...(select?.split(' ').reduce(
                (acc, cur) => {
                  const field = cur.trim();
                  acc[field] = 1;
                  return acc;
                },
                Object.keys(new PostModel()).map((k) => ({ [k]: 0 })),
              ) as any),
            },
          },
          {
            $lookup: {
              // lookup can be used to join two collections
              from: 'categories', // from the "categories" collection
              localField: 'categoryId', // using the "categoryId" field
              foreignField: '_id', // from the "categories" collection
              as: 'category', // as the "category" field
            },
          },
          {
            $unwind: {
              // unwind 将数组的每个元素解析为单个文档
              path: '$category', // the path to the array
              preserveNullAndEmptyArrays: true, // if set to true, MongoDB will still create a document if the array is empty
            },
          },
        ].filter(Boolean) as PipelineStage[],
      ),
      {
        limit: size,
        page,
      },
    );
  }

  /**
   * 根据文章 slug 查询文章
   * @param slug 文章slug
   */
  async getPostBySlug(slug: string) {
    const model = await this.model.findOne({ slug });
    if (!model) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: ExceptionMessage.PostIsNotExist,
      });
    }
    return model;
  }

  async getPostByID(id: string) {
    const model = await this.model.findById(id);
    if (!model) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: ExceptionMessage.PostIsNotExist,
      });
    }
    return model;
  }

  /**
   * 根据文章slug和分类slug查询文章
   */
  async getPostByCategoryAndSlug(
    category: string,
    slug: string,
    password?: any,
    isMaster?: boolean,
  ) {
    const categoryDocument = await this.categoryService.getCategoryBySlug(
      category,
    );
    if (!categoryDocument) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: ExceptionMessage.CategoryIsNotExist,
      });
    }
    const postDocument = await (
      await this.model
        .findOne({
          categoryId: categoryDocument._id,
          slug,
        })
        .then((post) => {
          if (!post || (!isMaster && post.hide)) {
            throw new RpcException({
              code: HttpStatus.NOT_FOUND,
              message: ExceptionMessage.PostIsNotExist,
            });
          }
          if (!isMaster && post.password) {
            if (!password || password !== post.password) {
              post.text = ExceptionMessage.PostIsProtected;
              post.summary = ExceptionMessage.PostIsProtected;
            } else {
              post.password = undefined;
            }
          } else {
            post.password = undefined;
          }
          return post;
        })
    ).populate('category');

    return postDocument.toJSON();
  }

  /**
   * 查询文章 slug 是否可用
   * @param slug 文章slug
   * @returns Promise<boolean>
   */
  async isAvailablePostSlug(slug: string) {
    return (await this.postModel.countDocuments({ slug })) === 0;
  }

  /**
   * 创建新文章
   * @param post 文章
   * @returns Promise<PostModel>
   */
  async createPost(post: PostModel) {
    const { categoryId } = post;
    const category = await this.categoryService.getCategoryById(
      categoryId as any as string,
    );
    if (!category) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: ExceptionMessage.CategoryIsNotExist,
      });
    }

    const slug = post.slug ? slugify(post.slug) : slugify(post.title);
    const isAvailableSlug = await this.isAvailablePostSlug(slug);
    if (!isAvailableSlug) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: ExceptionMessage.SlugIsExist,
      });
    }
    const res = await this.postModel.create({
      ...post,
      slug,
      categoryId: category.id,
      created: new Date(),
      modified: null,
    });
    this.notification.emit(NotificationEvents.SystemPostCreate, res);
    process.nextTick(async () => {
      await Promise.all([]);
    });
    return res;
  }

  /**
   * 更新文章
   * @returns Promise<PostModel>
   */
  async updatePostById(id: string, data: Partial<PostModel>) {
    const oldDocument = await this.postModel.findById(id).lean();
    if (!oldDocument) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: ExceptionMessage.PostIsNotExist,
      });
    }
    const { categoryId } = data;
    if (categoryId && categoryId !== oldDocument.categoryId) {
      const category = await this.categoryService.getCategoryById(
        categoryId as any as string,
      );
      if (!category) {
        throw new RpcException({
          code: HttpStatus.BAD_REQUEST,
          message: ExceptionMessage.CategoryIsNotExist,
        });
      }
    }
    if ([data.text, data.title, data.slug].some((i) => isDefined(i))) {
      const now = new Date();
      data.modified = now;
    }

    const originDocument = await this.postModel.findById(id);
    if (!originDocument) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: ExceptionMessage.PostIsNotExist,
      });
    }
    if (data.slug && data.slug !== originDocument.slug) {
      data.slug = slugify(data.slug);
      // 检查slug是否已存在
      const isAvailableSlug = await this.isAvailablePostSlug(data.slug);
      if (!isAvailableSlug) {
        throw new RpcException({
          code: HttpStatus.BAD_REQUEST,
          message: ExceptionMessage.SlugIsExist,
        });
      }
    }
    Object.assign(originDocument, omit(data, PostModel.protectedKeys));
    await originDocument.save();

    this.notification.emit(NotificationEvents.SystemPostUpdate, originDocument);
    process.nextTick(async () => {
      await Promise.all([]);
    });
    return originDocument.toObject();
  }

  /**
   * 根据id删除文章
   * @param id 文章id
   * @returns void
   **/
  async deletePostById(id: string) {
    await Promise.all([
      this.model.deleteOne({ _id: id }),
      // this.commentModel.deleteMany({ ref: id, refType: CommentType.Post }),
    ]);
  }

  async CreateDefaultPost(cateId: string) {
    await this.postModel.countDocuments({}).then(async (count) => {
      if (!count) {
        this.postModel.countDocuments({
          title: '欢迎来到 Mog',
          slug: 'welcome-to-mog',
          text: '欢迎来到 Mog，当你看到这条文章的时候，说明你已经成功的安装并初始化了 Mog。',
          categoryId: cateId,
        });
      }
    });
  }
}
