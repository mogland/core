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
import { CategoriesService } from "./categories.service";
import { CreateCategoriesDto } from "../../shared/dto/create-Categories-dto";

@Controller("categories")
@ApiTags("Categories")
export class CategoriesController {
  constructor(private CategoriesService: CategoriesService) {}

  @Get("find/:slug")
  @ApiOperation({
    summary: "获取分类内全部文章",
  })
  @ApiParam({ name: "slug", required: true, description: "分类slug", type: String })
  async findPost(@Param() param) {
    return await this.CategoriesService.findPost(param.slug);
    // return param.slug
  }

  @Get("list")
  @ApiOperation({
    summary: "获取全部分类",
  })
  @ApiQuery({name: "type", required: false, description: "查询参数", type: String, enum: ["all",'limit','num','list']})
  @ApiQuery({name: "page", required: false, description: "当type等于limit时的页码数", type: Number})
  async list(@Query() query) {
    return await this.CategoriesService.list(query);
  }

  @Post("create")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({
    summary: "新建分类",
  })
  @ApiBearerAuth("access-token")
  @ApiBody({type: CreateCategoriesDto})
  async create(@Body() data: CreateCategoriesDto) {
    return await this.CategoriesService.create(data);
  }

  @Post("update")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({
    summary: "修改分类",
  })
  @ApiBearerAuth("access-token")
  @ApiBody({type: CreateCategoriesDto})
  async edit(@Body() data: CreateCategoriesDto) {
    return await this.CategoriesService.update(data);
  }

  @Get(":slug")
  @ApiOperation({
    summary: "查询分类信息",
  })
  @ApiParam({ name: "slug", required: true, description: "分类slug", type: String })
  async findOne(@Param() param) {
    return await this.CategoriesService.findOne(param.slug);
  }

  @Get("check/:slug")
  @ApiOperation({
    summary: "检查是否存在此分类",
  })
  @ApiParam({ name: "slug", required: true, description: "分类slug", type: String })
  async check(@Param() param) {
    return await this.CategoriesService.check(param.slug);
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
    return await this.CategoriesService.delete(param.id);
  }
}
