import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { Paginator } from "~/common/decorator/http.decorator";
import { ApiName } from "~/common/decorator/openapi.decorator";
import { PagerDto } from "~/shared/dto/pager.dto";
import { addYearCondition } from "~/transformers/db-query.transformer";
import { ApiOperation } from "@nestjs/swagger";
import { CategoryAndSlugDto } from "./post.dto";
import { CannotFindException } from "~/common/exceptions/cant-find.exception";
import { Auth } from "~/common/decorator/auth.decorator";
import { PostModel } from "./post.model";
import { Types, PipelineStage } from "mongoose";
import { MongoIdDto } from "~/shared/dto/id.dto";
import { IsMaster } from "~/common/decorator/role.decorator";
@Controller("posts")
@ApiName
export class PostController {
  constructor(
    private readonly postService: PostService
  ) // private readonly countingService: CountingService,
  {}

  @Get('/')
  @Paginator
  @ApiOperation({ summary: "获取文章列表(附带分页器)" })
  async getPaginate(@Query() query: PagerDto, @IsMaster() isMaster: boolean) {
    const { size, select, page, year, sortBy, sortOrder } = query
    let hideProperty
    if (!isMaster) {
      hideProperty = {
        $project: {
          hide: 0,
          password: 0,
          rss: 0,
        },
      }
    }
    return this.postService.model.aggregatePaginate(
      this.postService.model.aggregate(
        [
          {
            $match: {
              ...addYearCondition(year),
            },
          },
          // @see https://stackoverflow.com/questions/54810712/mongodb-sort-by-field-a-if-field-b-null-otherwise-sort-by-field-c
          {
            $addFields: { 
              sortField: {
                // create a new field called "sortField"
                $cond: {
                  // and assign a value that depends on
                  if: { $ne: ['$pin', null] }, // whether "b" is not null
                  then: '$pinOrder', // in which case our field shall hold the value of "a"
                  else: '$$REMOVE',
                },
              },
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
            $project: { // project the fields we want to keep
              sortField: 0, // remove "sort" field if needed
            },
          },
          select && {
            $project: {
              ...(select?.split(' ').reduce(
                (acc, cur) => {
                  const field = cur.trim()
                  acc[field] = 1
                  return acc
                },
                Object.keys(new PostModel()).map((k) => ({ [k]: 0 })),
              ) as any),
            },
          },
          {
            $lookup: { // lookup can be used to join two collections
              from: 'categories', // from the "categories" collection
              localField: 'categoryId', // using the "categoryId" field
              foreignField: '_id', // from the "categories" collection
              as: 'category', // as the "category" field
            },
          },
          {
            $unwind: { // unwind 将数组的每个元素解析为单个文档
              path: '$category', // the path to the array
              preserveNullAndEmptyArrays: true, // if set to true, MongoDB will still create a document if the array is empty
            },
          },
          // 移除 hide 字段
          ...hideProperty,
        ].filter(Boolean) as PipelineStage[],
      ),
      {
        limit: size,
        page,
      },
    )
  }

  @Get("/:category/:slug")
  @ApiOperation({ summary: "根据分类名与自定义别名获取文章详情" })
  async getByCategoryAndSlug(@Param() params: CategoryAndSlugDto) {
    const { category, slug } = params;
    const categoryDocument = await this.postService.getCategoryBySlug(category);
    if (!categoryDocument) {
      throw new NotFoundException("该分类不存在w");
    }
    const postDocument = await this.postService.model
      .findOne({
        category: categoryDocument._id,
        slug,
      })
      .populate("category");

    if (!postDocument) {
      throw new CannotFindException();
    }
    return postDocument.toJSON();
  }

  @Post("/")
  @Auth()
  @ApiOperation({ summary: "创建文章" })
  async create(@Body() body: PostModel) {
    const _id = new Types.ObjectId();
    return await this.postService.model.create({
      ...body,
      created: new Date(),
      modified: null,
      slug: body.slug ?? _id.toHexString(),
    });
  }

  @Put("/:id")
  @Auth()
  @ApiOperation({ summary: "更新文章" })
  async update(@Param() params: MongoIdDto, @Body() body: PostModel) {
    const postDocument = await this.postService.model.findById(params.id);
    if (!postDocument) {
      throw new CannotFindException();
    }
    return await postDocument.updateOne(body);
  }

  @Patch("/:id")
  @Auth()
  @ApiOperation({ summary: "更新文章" })
  async patch(@Param() params: MongoIdDto, @Body() body: PostModel) {
    const postDocument = await this.postService.model.findById(params.id);
    if (!postDocument) {
      throw new CannotFindException();
    }
    return await postDocument.updateOne(body);
  }

  @Delete("/:id")
  @Auth()
  @ApiOperation({ summary: "删除文章" })
  async delete(@Param() params: MongoIdDto) {
    const { id } = params;
    await this.postService.deletePost(id);
  }
}
