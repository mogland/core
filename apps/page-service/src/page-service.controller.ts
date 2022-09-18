import { Controller, Get } from '@nestjs/common';
import { PageService } from './page-service.service';

@Controller()
export class PageServiceController {
  constructor(private readonly PageService: PageService) {}

  @Get()
  getHello(): string {
    return this.PageService.getHello();
  }
}
