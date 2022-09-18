import { Injectable } from '@nestjs/common';

@Injectable()
export class PageService {
  getHello(): string {
    return 'Hello World!';
  }
}
