import { Controller } from '@nestjs/common';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { CommentsService } from './comments.service';

@Controller('comments')
@ApiName
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
}
