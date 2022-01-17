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
  async list(@Query() query) {
    return this.pagesService.list(query); 
    // query.type: 'all'(全部显示)/'num'（仅返回长度）/'list'（返回列表 不返回内容）/'limit'（限制列表长度，需要配合query.page）/'query'（使用数据库语法查询,需要返回query.query）
  }

  @Get(":path")
  @ApiOperation({
    summary: "获取某个页面",
  })
  async findOne(@Param() params) {
    return this.pagesService.findOne(params.path);
  }

  @Post("send")
  @ApiOperation({
    summary: "发布页面",
  })
  @UseGuards(AuthGuard("jwt"))
  async send(@Body() data: CreatePagesDto) {
    // here is no need to filter XSS here
    // because this is user controller only
    return await this.pagesService.send(data);
  }

  @Get("delete/:path")
  @ApiOperation({
    summary: "删除页面",
  })
  // @UseGuards(AuthGuard('jwt'))
  async del(@Param() params) {
    return await this.pagesService.del(params.path);
  }
  // if delete successfully, it will return affected = 1
}
