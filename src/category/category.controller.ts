import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {

    constructor(
        private categoryService: CategoryService
    ){}

    @Get('list/:slug')
    async find(@Param() param){
        return await this.categoryService.find(param.slug)
        // return param.slug
    }


}
