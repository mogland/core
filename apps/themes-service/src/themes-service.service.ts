import { Injectable } from '@nestjs/common';

@Injectable()
export class ThemesServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
