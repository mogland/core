import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  forwardRef,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { ApiName } from "~/common/decorator/openapi.decorator";
import { PostService } from "../post/post.service";
import {
  MultiCategoriesQueryDto,
  MultiQueryTagAndCategoryDto,
  SlugorIdDto,
} from "./category.dto";
import {
  CategoryModel,
  CategoryType,
  PartialCategoryModel,
} from "./category.model";
import { CategoryService } from "./category.service";
import { isValidObjectId } from "mongoose";
import { CannotFindException } from "~/common/exceptions/cant-find.exception";
import { Auth } from "~/common/decorator/auth.decorator";
import { MongoIdDto } from "~/shared/dto/id.dto";

@Controller({ path: "categories" })
@ApiName
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService
  ) {}

  @Get("/")
  @ApiOperation({ summary: "多分类查询、分类列表" })
  async getCategories(@Query() query: MultiCategoriesQueryDto) {
    const {
      ids, // 分类id列表,c ategories is category's mongo id
      joint, // 是否连接分类与文章
      type = CategoryType.Category, // 分类类型
    } = query;

    if (ids) {
      // 获取指定分类
      const ignores = "-text -summary -hide -images -commentsIndex"; // 忽略的字段, -表示忽略
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
          })
        );

        return { entries: obj }; // 分类与文章列表
      } else {
        await Promise.all(
          ids.map(async (id) => {
            const posts = await this.postService.model
              .find({ categoryId: id }, ignores)
              .sort({ created: -1 })
              .lean();
            const category = await this.categoryService.findCategoryById(id);
            obj[id] = Object.assign({ ...category, children: posts });
            return id;
          })
        );

        return { entries: obj };
      }
    }
    return type === CategoryType.Category
      ? await this.categoryService.findAllCategory()
      : await this.categoryService.getPostTagsSum();
  }

  @Get("/:query")
  @ApiOperation({ summary: "根据分类id或者标签名查询分类" })
  @ApiParam({
    name: "query",
    type: "string",
    required: true,
    description:
      "如果这个是标签，则query为标签名，如果是分类，则query为分类id或分类名",
  })
  @ApiQuery({
    // 查询参数
    name: "tag", // 参数名
    type: "boolean", // 参数类型
    description: "选择分类 或 标签云查询",
    enum: ["true", "false"], // 可选值
    required: false, // 是否必填
  })
  async getCategoryByCategoryIdOrTag(
    @Param() { query }: SlugorIdDto,
    @Query() { tag }: MultiQueryTagAndCategoryDto // 如果这个是标签，则tag为true，如果是分类，则tag为分类id
  ) {
    // 判断必要Query参数是否存在
    if (!query) {
      // 如果没有query 禁止通行
      throw new BadRequestException("query is required");
    }
    if (tag === true) {
      return {
        tag: query, // 标签名
        data: await this.categoryService.findPostWithTag(query), // 标签下的文章
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
      throw new CannotFindException();
    }

    const children =
      (await this.categoryService.findCategoryPost(data._id, {
        $and: [tag ? { tags: tag } : {}], // 如果tag存在，则查询标签下的文章
      })) || [];

    return {
      data: { ...data, children },
    };
  }

  @Post("/")
  @ApiOperation({ summary: "创建分类" })
  @Auth()
  @ApiBody({ type: CategoryModel })
  async create(@Body() { name, slug }: CategoryModel) {
    return this.categoryService.model.create({ name, slug: slug ?? name }); // 创建分类
  }

  @Put("/:id")
  @ApiOperation({ summary: "更新分类" })
  @Auth()
  @ApiParam({ name: "id", description: "分类id" })
  @ApiBody({ description: "分类信息", type: CategoryModel })
  async update(
    @Param() { id }: MongoIdDto,
    @Body() { type, slug, name }: CategoryModel
  ) {
    await this.categoryService.model.updateOne(
      { _id: id },
      { type, slug, name }
    ); // 更新分类信息
    return this.categoryService.model.findById(id); // 返回更新后的分类
  }

  @Patch("/:id") // patch 方法用于更新部分字段
  @ApiOperation({ summary: "更新分类" })
  @Auth()
  @HttpCode(204)
  async patch(@Param() params: MongoIdDto, @Body() body: PartialCategoryModel) {
    const { id } = params;
    await this.categoryService.model.updateOne({ _id: id }, body);
    return;
  }

  @Delete("/:id")
  @ApiOperation({ summary: "删除分类" })
  @Auth()
  @ApiParam({ name: "id", description: "分类id" })
  async deleteCategory(@Param() { id }: MongoIdDto): Promise<any> {
    const category = await this.categoryService.model.findById(id);
    if (!category) {
      throw new CannotFindException();
    }
    const postsInCategory = await this.categoryService.findPostsInCategory(
      category.id
    );
    if (postsInCategory.length > 0) {
      throw new BadRequestException("该分类下有文章，不能删除");
    }
    const res = await this.categoryService.model.deleteOne({
      _id: category.id,
    }); // 删除分类
    // 需要兜底，若删除全部分类，则需要自动创建默认分类
    if ((await this.categoryService.model.countDocuments({})) === 0) {
      await this.categoryService.createDefaultCategory();
    }

    return res;
  }
}
