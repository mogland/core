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
import { CreatePagesDto } from "../../shared/dto/create-pages-dto";
import { PagesService } from "./pages.service";

@Controller("pages")
@ApiTags("Pages")
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Get("list")
  @ApiOperation({
    summary: "获取全部页面",
  })
  @ApiQuery({name: "type", required: false, description: "查询参数", type: String, enum: ["all",'limit','num','list']})
  @ApiQuery({name: "page", required: false, description: "当type等于limit时的页码数", type: Number})
  async list(@Query() query) {
    return this.pagesService.list(query); 
    // query.type: 'all'(全部显示)/'num'（仅返回长度）/'list'（返回列表 不返回内容）/'limit'（限制列表长度，需要配合query.page）/'query'（使用数据库语法查询,需要返回query.query）
  }

  @Get(":path")
  @ApiOperation({
    summary: "获取某个页面",
  })
  @ApiQuery({type: String, name: "path"})
  async findOne(@Param() param) {
    return this.pagesService.findOne(param.path);
  }

  @Post("send")
  @ApiOperation({
    summary: "发布页面",
  })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: CreatePagesDto })
  @UseGuards(AuthGuard("jwt"))
  async send(@Body() data: CreatePagesDto) {
    // here is no need to filter XSS here
    // because this is user controller only
    return await this.pagesService.send(data);
  }

  // 更新文章
  @Post("update")
  @ApiOperation({
    summary: "更新页面",
  })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: CreatePagesDto })
  @UseGuards(AuthGuard("jwt"))
  async update(@Body() data: CreatePagesDto) {
    return await this.pagesService.update(data);
  }

  @Delete("delete/:path")
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "删除页面",
  })
  @ApiParam({name: "path", required: true, description: "文章路径", type: String})
  async del(@Param() param) {
    return await this.pagesService.del(param.path);
  }
  // if delete successfully, it will return affected = 1
}
