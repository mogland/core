import { Controller, Get, Param, Query } from '@nestjs/common'
import { PostService } from './post.service'
import { HTTPDecorators } from '~/common/decorator/http.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { PagerDto } from '~/shared/dto/pager.dto'
import { BusinessException } from '~/common/exceptions/business.excpetion'
import { ErrorCodeEnum } from '~/constants/error-code.constant'
import { addYearCondition } from '~/transformers/db-query.transformer'
import { ApiOperation } from '@nestjs/swagger'
import { CategoryAndSlugDto } from './post.dto'

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
  async getByCategoryAndSlug(@Param() params: CategoryAndSlugDto){}
}
