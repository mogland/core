import {
  BadRequestException,
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
import { md5 } from "~/utils/tools.util";
import { Cookies } from "~/common/decorator/cookie.decorator";
import { IpLocation, IpRecord } from "~/common/decorator/ip.decorator";
import { ThumbsService } from "~/processors/helper/helper.thumbs.service";
@Controller("posts")
@ApiName
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly thumbsService: ThumbsService
  ) {}

  @Get("/")
  @Paginator
  @ApiOperation({ summary: "获取文章列表(附带分页器)" })
  async getPaginate(@Query() query: PagerDto, @IsMaster() isMaster: boolean) {
    const { size, select, page, year, sortBy, sortOrder } = query;
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
                  if: { $ne: ["$pin", null] }, // whether "b" is not null
                  then: "$pinOrder", // in which case our field shall hold the value of "a"
                  else: "$$REMOVE",
                },
              },
            },
          },
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
                  if: { $ne: ["$password", null] }, // if "password" is not null
                  then: { $concat: ["内容已被隐藏，请输入密码"] }, // then the value of "内容已被隐藏"
                  else: "$title", // otherwise, use the original title
                }, // $concat: 用于拼接字符串
              },
              text: {
                $cond: {
                  // 如果密码字段不为空，且isMaster为false，则不显示
                  if: {
                    $ne: ["$password", null],
                  }, // whether "b" is not null
                  then: { $concat: ["内容已被隐藏，请输入密码"] },
                  else: "$text",
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
              ...(select?.split(" ").reduce(
                (acc, cur) => {
                  const field = cur.trim();
                  acc[field] = 1;
                  return acc;
                },
                Object.keys(new PostModel()).map((k) => ({ [k]: 0 }))
              ) as any),
            },
          },
          {
            $lookup: {
              // lookup can be used to join two collections
              from: "categories", // from the "categories" collection
              localField: "categoryId", // using the "categoryId" field
              foreignField: "_id", // from the "categories" collection
              as: "category", // as the "category" field
            },
          },
          {
            $unwind: {
              // unwind 将数组的每个元素解析为单个文档
              path: "$category", // the path to the array
              preserveNullAndEmptyArrays: true, // if set to true, MongoDB will still create a document if the array is empty
            },
          },
        ].filter(Boolean) as PipelineStage[]
      ),
      {
        limit: size,
        page,
      }
    );
  }

  @Get("/:id")
  @ApiOperation({ summary: "通过id获取文章详情" })
  @Auth()
  async getPost(@Param() params) {
    const post = this.postService.model
      .findById(params.id)
      .lean({ getters: true }); // getters: true to get the virtuals
    // TODO: Master Check
    if (!post) {
      throw new CannotFindException();
    }
    return post;
  }

  @Get("/:category/:slug")
  @ApiOperation({ summary: "根据分类名与自定义别名获取文章详情" })
  async getByCategoryAndSlug(
    @Param() params: CategoryAndSlugDto,
    @IsMaster() isMaster: boolean,
    @Query("password") password: any
  ) {
    const { category, slug } = params;
    const categoryDocument = await this.postService.getCategoryBySlug(category);
    if (password === undefined || !password) password = null;
    if (!categoryDocument) {
      throw new NotFoundException("该分类不存在w");
    }
    const postDocument = await (
      await this.postService.model
        .findOne({
          category: categoryDocument._id,
          slug,
        })
        // 如果不是master，并且password不为空，则将text,summary修改
        .then((postDocument) => {
          if (!postDocument) {
            throw new CannotFindException();
          }
          if (!isMaster && postDocument.password) {
            if (!password || md5(password) !== postDocument.password) {
              // 将传入的 password 转换为 md5 字符串，与数据库中的 password 比较
              // 将text, summary改为"内容已被隐藏"
              postDocument.text = "内容已被隐藏，请输入密码";
              postDocument.summary = "内容已被隐藏，请输入密码";
              
            } else {
              postDocument.password = null;
            }
          } else {
            postDocument.password = null;
          }
          return postDocument;
        })
    ).populate("category"); // populate the category field

    if (!postDocument || postDocument.hide) {
      // 若遇到了 hide 字段为 true 的文章，则自动返回 404
      throw new CannotFindException();
    }
    return postDocument.toJSON();
  }

  @Post("/")
  @Auth()
  @ApiOperation({ summary: "创建文章" })
  async create(@Body() body: PostModel) {
    const _id = new Types.ObjectId();
    body.password
      ? (body.password = md5(body.password))
      : (body.password = null); // 将传入的 password 转换为 md5 字符串
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
    body.password
      ? (body.password = md5(body.password))
      : (body.password = null);
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
    body.password
      ? (body.password = md5(body.password))
      : (body.password = null);
    return await postDocument.updateOne(body);
  }

  @Delete("/:id")
  @Auth()
  @ApiOperation({ summary: "删除文章" })
  async delete(@Param() params: MongoIdDto) {
    const { id } = params;
    await this.postService.deletePost(id);
  }

  @Get("/_like")
  async thumbsUpArticle(
    @Query() query: MongoIdDto,
    @IpLocation() location: IpRecord
  ) {
    const { ip } = location;
    const { id } = query;
    try {
      const res = await this.thumbsService.updateLikeCount("Post", id, ip);
      if (!res) {
        throw new BadRequestException("你已经支持过啦!");
      }
    } catch (e: any) {
      throw new BadRequestException(e);
    }

    return;
  }
}
