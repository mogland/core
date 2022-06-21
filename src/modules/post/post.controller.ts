import { Controller, Get, Query } from '@nestjs/common'
import { PostService } from './post.service'
import { HTTPDecorators } from '~/common/decorator/http.decorator'
import { ApiName } from '~/common/decorator/openapi.decorator'
import { PagerDto } from '~/shared/dto/pager.dto'
import { BusinessException } from '~/common/exceptions/business.excpetion'
import { ErrorCodeEnum } from '~/constants/error-code.constant'

@Controller('posts')
@ApiName
export class PostController {
  constructor(
    private readonly postService: PostService,
    // private readonly countingService: CountingService,
  ) {}

  @HTTPDecorators.Paginator
  @Get('/')
  async getPaginate(@Query() query: PagerDto) {
    const { page, select, size } = query
    return this.postService.model.paginate(
      {},
      {
        page,
        limit: size,
        select,
        lean: true,
      },
    )
  }

  @Get('/*')
  async notFound() {
    throw new BusinessException(ErrorCodeEnum.PostNotFoundError)
  }
}
