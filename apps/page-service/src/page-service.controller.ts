import slugify from 'slugify';
import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import {
  CategoryEvents,
  PageEvents,
  PostEvents,
} from '~/shared/constants/event.constant';
import { PagerDto } from '~/shared/dto/pager.dto';

import { CategoryService } from './category.service';
import { PostModel } from './model/post.model';
import { PostService } from './post-service.service';
import { PageService } from './page-service.service';
import { PageModel, PartialPageModel } from './model/page.model';
import { MongoIdDto } from '~/shared/dto/id.dto';
import { MultiCategoriesQueryDto } from './dto/category.dto';
import { isValidObjectId } from 'mongoose';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { CategoryModel, CategoryType } from './model/category.model';
import { NotImplementedRpcExcption } from '~/shared/exceptions/not-implemented-rpc-exception';
import { NotFoundRpcExcption } from '~/shared/exceptions/not-found-rpc-exception';
import { BadRequestRpcExcption } from '~/shared/exceptions/bad-request-rpc-exception';

@Controller()
export class PageServiceController {
  constructor(
    private readonly pageService: PageService,
    private readonly postService: PostService,
    private readonly categoryService: CategoryService,
  ) {}

  // ==================== Ping ====================
  @MessagePattern({ cmd: PageEvents.Ping })
  pingPage() {
    return 'pong';
  }
  @MessagePattern({ cmd: PostEvents.Ping })
  pingPost() {
    return 'pong';
  }
  @MessagePattern({ cmd: CategoryEvents.Ping })
  pingCategory() {
    return 'pong';
  }

  // ==================== Category ====================

  @MessagePattern({ cmd: CategoryEvents.CategoryGetAll })
  async multiGetCategories(query: MultiCategoriesQueryDto) {
    return this.categoryService.multiGetCategories(query);
  }

  @MessagePattern({ cmd: CategoryEvents.CategoryGet })
  @ApiParam({
    name: 'query',
    type: 'string',
    required: true,
    description:
      '如果这个是标签，则query为标签名，如果是分类，则query为分类id或分类名',
  })
  @ApiQuery({
    // 查询参数
    name: 'tag', // 参数名
    type: 'boolean', // 参数类型
    description: '选择分类 或 标签云查询',
    enum: ['true', 'false'], // 可选值
    required: false, // 是否必填
  })
  async getCategoryByCategoryIdOrTag(input: {
    _query: string;
    _tag: boolean; // 如果这个是标签，则tag为true，如果是分类，则tag为分类id
  }) {
    const query = input._query;
    const tag = input._tag;
    // 判断必要Query参数是否存在
    if (!query) {
      // 如果没有query 禁止通行
      throw new BadRequestRpcExcption(ExceptionMessage.QueryArgIsRequire);
    }
    if (tag === true) {
      return {
        isTag: true,
        data: {
          name: query,
          children: await this.categoryService.findPostWithTag(query),
        },
      };
    }

    const data = isValidObjectId(query) // 判断是否是ObjectId
      ? await this.categoryService.model
          .findById(query)
          .sort({ created: -1 })
          .lean()
      : await this.categoryService.model
          .findOne({ slug: query })
          .sort({ created: -1 })
          .lean();

    if (!data) {
      throw new NotFoundRpcExcption(ExceptionMessage.CantFindCategory);
    }

    const children =
      (await this.categoryService.findCategoryPost(data._id, {
        $and: [tag ? { tags: tag } : {}], // 如果tag存在，则查询标签下的文章
      })) || [];

    return { data: { ...data, children }, isTag: false };
  }

  @MessagePattern({ cmd: CategoryEvents.CategoryCreate })
  @ApiOperation({ summary: '创建分类' })
  async create({ name, slug }: CategoryModel) {
    return this.categoryService.model.create({ name, slug: slug ?? name }); // 创建分类
  }

  @MessagePattern({ cmd: CategoryEvents.CategoryMerge })
  @ApiOperation({ summary: '合并分类或标签 (Beta)' })
  async merge(body: { type: CategoryType; from: string; to: string }) {
    if (!body.from || !body.to) {
      throw new BadRequestException('from and to are required');
    }
    if (body.from === body.to) {
      throw new BadRequestException('from and to are same');
    }
    if (body.type == CategoryType.Tag) {
      // 合并标签
      await this.categoryService.mergeTag(body.from, body.to);
    } else if (body.type == CategoryType.Category) {
      // 合并分类
      await this.categoryService.mergeCategory(body.from, body.to);
    } else {
      throw new BadRequestException('type is invalid');
    }
    return { message: 'success' };
  }

  @MessagePattern({ cmd: CategoryEvents.CategoryPatch })
  @ApiOperation({ summary: '更新分类' })
  async update(_: { _id: string; _data: CategoryModel }) {
    const id = _._id;
    return this.categoryService.updateCategory(id, _._data);
  }

  @MessagePattern({ cmd: CategoryEvents.CategoryDelete })
  @ApiOperation({ summary: '删除分类' })
  async deleteCategory({ id }: MongoIdDto) {
    return this.categoryService.deleteCategory(id);
  }

  // ====================== Page ======================

  @MessagePattern({ cmd: PageEvents.PageGetAll })
  @ApiOperation({ summary: '获取页面列表 (分页)' })
  async getPagesSummary(query: PagerDto) {
    return this.pageService.getPaginate(query);
  }

  @MessagePattern({ cmd: PageEvents.PagesGetAll })
  @ApiOperation({ summary: '获取页面列表' })
  async getPages() {
    return this.pageService.model.find().sort({ created: -1 });
  }

  @MessagePattern({ cmd: PageEvents.PageGetByIdWithMaster })
  @ApiOperation({ summary: '通过 id 获取页面' })
  async getPage(params: { id: string }) {
    return this.pageService.getPageById(params.id);
  }

  @MessagePattern({ cmd: PageEvents.PageGet })
  @ApiOperation({ summary: '通过 slug 获取页面' })
  async getPageBySlug(params: {
    slug: string;
    password?: string;
    isMaster?: boolean;
  }) {
    return this.pageService.getPageBySlug(
      params.slug,
      params.password,
      params.isMaster,
    );
  }

  @MessagePattern({ cmd: PageEvents.PageGetByIdWithMaster })
  @ApiOperation({ summary: '通过 id 获取页面' })
  async getPageByID(id: string) {
    return this.pageService.getPageById(id);
  }

  @MessagePattern({ cmd: PageEvents.PageCreate })
  @ApiOperation({ summary: '创建页面' })
  async createPage(page: PageModel) {
    const slug = page.slug ? slugify(page.slug) : slugify(page.title);
    Object.assign(page, { slug });
    return this.pageService.create(page);
  }

  @MessagePattern({ cmd: PageEvents.PagePatch })
  @ApiOperation({ summary: '更新页面' })
  async patch(input: { params: MongoIdDto; body: PartialPageModel }) {
    return await this.pageService.updateById(input.params.id, input.body);
  }

  // ==================== Post ====================

  @MessagePattern({ cmd: PostEvents.PostsListGet })
  @ApiOperation({ summary: '获取文章列表(附带分页器)' })
  async getPaginate(input: { query: PagerDto; isMaster: boolean }) {
    return this.postService.aggregatePaginate(input.query, input.isMaster);
  }

  @MessagePattern({ cmd: PostEvents.PostsListGetAll })
  async getPostsList() {
    return this.postService.model.find().sort({ created: -1 });
  }

  @MessagePattern({ cmd: PostEvents.PostGetByMaster })
  @ApiOperation({ summary: '通过id获取文章详情(带权限)' })
  async getPost(id: string) {
    return this.postService.getPostByID(id);
  }

  @MessagePattern({ cmd: PostEvents.PostGet })
  @ApiOperation({ summary: '根据分类名与自定义别名获取文章详情' })
  async getPostByCategoryAndSlug(params: {
    category: string;
    slug: string;
    password?: string;
    isMaster?: boolean;
  }) {
    return this.postService.getPostByCategoryAndSlug(
      params.category,
      params.slug,
      params.password,
      params.isMaster,
    );
  }

  @MessagePattern({ cmd: PostEvents.PostCreate })
  @ApiOperation({ summary: '创建文章' })
  async createPost(post: PostModel) {
    const slug = post.slug ? slugify(post.slug) : slugify(post.title);
    Object.assign(post, { slug });
    return this.postService.createPost(post);
  }

  @MessagePattern({ cmd: PostEvents.PostPatch })
  @ApiOperation({ summary: '更新文章' })
  async patchPost(input: { id: string; post: PostModel }) {
    const slug = input.post.slug
      ? slugify(input.post.slug)
      : slugify(input.post.title);
    Object.assign(input.post, { slug });
    return this.postService.updatePostById(input.id, input.post);
  }

  @MessagePattern({ cmd: PostEvents.PostDelete })
  @ApiOperation({ summary: '删除文章' })
  async deletePost(id: string) {
    return this.postService.deletePostById(id);
  }

  @MessagePattern({ cmd: PostEvents.PostThumbUp })
  @ApiOperation({ summary: '点赞文章' })
  async thumbUpPost(_id: string) {
    throw new NotImplementedRpcExcption('Not Implemented');
  }
}
