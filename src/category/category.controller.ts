import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./create-category-dto";

@Controller("category")
@ApiTags("Category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get("find/:slug")
  @ApiOperation({
    summary: "获取分类内全部文章",
  })
  async find(@Param() param) {
    return await this.categoryService.find(param.slug);
    // return param.slug
  }

  @Get("list")
  @ApiOperation({
    summary: "获取全部分类",
  })
  async list(@Query() query) {
    return await this.categoryService.list(query.type);
  }

  @Post("create")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({
    summary: "新建分类",
  })
  async create(@Body() data: CreateCategoryDto) {
    return await this.categoryService.create(data);
  }

  @Get("check/:slug")
  @ApiOperation({
    summary: "检查是否存在此分类",
  })
  async check(@Param() param) {
    return await this.categoryService.check(param.slug);
  }
}
