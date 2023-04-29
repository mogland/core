import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
