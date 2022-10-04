import { Controller } from '@nestjs/common';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { CommentsBasicService } from './comments.basic.service';

@Controller('comments')
@ApiName
export class CommentsController {
  constructor(private readonly commentsBasicService: CommentsBasicService) {}
}
