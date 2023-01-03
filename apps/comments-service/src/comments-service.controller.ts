import { Controller, Get } from '@nestjs/common';
import { CommentsServiceService } from './comments-service.service';

@Controller()
export class CommentsServiceController {
  constructor(
    private readonly commentsServiceService: CommentsServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.commentsServiceService.getHello();
  }
}
