import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { PostService } from './post.service'
import { HTTPDecorators } from '~/common/decorator/http.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { PagerDto } from '~/shared/dto/pager.dto'
import { BusinessException } from '~/common/exceptions/business.excpetion'
import { ErrorCodeEnum } from '~/constants/error-code.constant'
import { addYearCondition } from '~/transformers/db-query.transformer'
import { ApiOperation } from '@nestjs/swagger'
import { CategoryAndSlugDto } from './post.dto'
import { CannotFindException } from '~/common/exceptions/cant-find.exception'
import { Auth } from '~/common/decorator/auth.decorator'
import { PostModel } from './post.model'
import { Types } from 'mongoose'
import { MongoIdDto } from '~/shared/dto/id.dto'
@Controller('posts')
@ApiName
export class PostController {
  constructor(
    private readonly postService: PostService,
    // private readonly countingService: CountingService,
  ) {}

  @HTTPDecorators.Paginator
  @Get('/')
  @ApiOperation({ summary: '获取文章列表(附带分页器)' })
  async getPaginate(@Query() query: PagerDto) {
    const { size, select, page, year, sortBy, sortOrder } = query
    return this.postService.model.paginate(
      {
        ...addYearCondition(year)
      },
      {
        page,
        limit: size,
        select,
        sort: sortBy
          ? { [sortBy]: sortOrder || -1 }
          : { createdAt: -1, pin: -1, created: -1 },
      },
    )
  }

  @Get('/:category/:slug')
  @ApiOperation({ summary: '根据分类名与自定义别名获取文章详情' })
  async getByCategoryAndSlug(@Param() params: CategoryAndSlugDto){
    const { category, slug } = params
    const categoryDocument = await this.postService.getCategoryBySlug(category)
    if (!categoryDocument) {
      throw new NotFoundException("该分类不存在w")
    }
    const postDocument = await this.postService.model
      .findOne({
        category: categoryDocument._id,
        slug,
      })
      .populate('category')

    if (!postDocument) {
      throw new CannotFindException()
    }
    return postDocument.toJSON()
  }

  @Post('/')
  @Auth()
  @ApiOperation({ summary: '创建文章' })
  async create(@Body() body: PostModel) {
    const _id = new Types.ObjectId()
    return await this.postService.model.create({
      ...body,
      created: new Date(),
      modified: null,
      slug: body.slug ?? _id.toHexString(),
    })
  }

  @Put('/:id')
  @Auth()
  @ApiOperation({ summary: '更新文章' })
  async update(@Param() params: MongoIdDto, @Body() body: PostModel) {
    const postDocument = await this.postService.model.findById(params.id)
    if (!postDocument) {
      throw new CannotFindException()
    }
    return await postDocument.updateOne(body)
  }

  @Patch('/:id')
  @Auth()
  @ApiOperation({ summary: '更新文章' })
  async patch(@Param() params: MongoIdDto, @Body() body: PostModel) {
    const postDocument = await this.postService.model.findById(params.id)
    if (!postDocument) {
      throw new CannotFindException()
    }
    return await postDocument.updateOne(body)
  }

  @Delete('/:id')
  @Auth()
  @ApiOperation({ summary: '删除文章' })
  async delete(@Param() params: MongoIdDto) {
    const { id } = params
    await this.postService.deletePost(id)
  }

}
