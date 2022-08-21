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
import { ApiOperation } from "@nestjs/swagger";
import { CategoryAndSlugDto } from "./post.dto";
import { CannotFindException } from "~/common/exceptions/cant-find.exception";
import { Auth } from "~/common/decorator/auth.decorator";
import { PostModel } from "./post.model";
import { Types } from "mongoose";
import { MongoIdDto } from "~/shared/dto/id.dto";
import { IsMaster } from "~/common/decorator/role.decorator";
import { md5 } from "~/utils/tools.util";
import { IpLocation, IpRecord } from "~/common/decorator/ip.decorator";
import { ThumbsService } from "~/processors/helper/helper.thumbs.service";
import { CacheService } from "~/processors/cache/cache.service";
@Controller("posts")
@ApiName
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly thumbsService: ThumbsService,
    private readonly redis: CacheService,
  ) { }

  @Get("/")
  @Paginator
  @ApiOperation({ summary: "获取文章列表(附带分页器)" })
  async getPaginate(@Query() query: PagerDto, @IsMaster() isMaster: boolean) {
    return this.postService.aggregatePaginate(query, isMaster)
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
    return await this.postService.updateById(params.id, body);
  }

  @Delete("/:id")
  @Auth()
  @ApiOperation({ summary: "删除文章" })
  async delete(@Param() params: MongoIdDto) {
    const { id } = params;
    await this.postService.deletePost(id);
  }

  @Patch("/createIndex")
  // @Auth()
  @ApiOperation({ summary: "创建或更新文章 json 索引" })
  async createIndex() {
    return await this.postService.createIndex();
  }

  @Get("/indexes")
  // @Auth()
  @ApiOperation({ summary: "获取文章索引" })
  async getIndexes() {
    return await this.redis.get("posts-index");
  }

  @Delete("/indexes")
  // @Auth()
  @ApiOperation({ summary: "删除文章索引" })
  async deleteIndexes() {
    return await this.redis.del("posts-index");
  }

  @Get("/search")
  @ApiOperation({ summary: "搜索文章" })
  async search(@Query("key") key: string) {
    return await this.postService.search(key);
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
