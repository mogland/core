import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
