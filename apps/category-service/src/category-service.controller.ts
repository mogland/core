import { Controller, Get } from '@nestjs/common';
import { CategoryService } from './category-service.service';

@Controller()
export class CategoryServiceController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  getHello(): string {
    return this.categoryService.getHello();
  }
}
