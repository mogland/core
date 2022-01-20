import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "../../shared/dto/create-category-dto";

@Controller("category")
@ApiTags("Category")
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get("find/:slug")
  @ApiOperation({
    summary: "获取分类内全部文章",
  })
  @ApiParam({ name: "slug", required: true, description: "分类slug", type: String })
  async find(@Param() param) {
    return await this.categoryService.find(param.slug);
    // return param.slug
  }

  @Get("list")
  @ApiOperation({
    summary: "获取全部分类",
  })
  @ApiQuery({name: "type", required: false, description: "查询参数", type: String, enum: ["all",'limit','num','list']})
  @ApiQuery({name: "page", required: false, description: "当type等于limit时的页码数", type: Number})
  async list(@Query() query) {
    return await this.categoryService.list(query);
  }

  @Post("create")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({
    summary: "新建分类",
  })
  @ApiBearerAuth("access-token")
  @ApiBody({type: CreateCategoryDto})
  async create(@Body() data: CreateCategoryDto) {
    return await this.categoryService.create(data);
  }

  @Get("check/:slug")
  @ApiOperation({
    summary: "检查是否存在此分类",
  })
  @ApiParam({ name: "slug", required: true, description: "分类slug", type: String })
  async check(@Param() param) {
    return await this.categoryService.check(param.slug);
  }

  // 删除分类
  @Delete("delete/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({
    summary: "删除分类",
  })
  @ApiBearerAuth("access-token")
  @ApiParam({ name: "id", required: true, description: "分类id", type: Number })
  async delete(@Param() param) {
    return await this.categoryService.delete(param.id);
  }
}
