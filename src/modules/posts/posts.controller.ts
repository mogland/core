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
import { CreatePostDto } from "../../shared/dto/create-post-dto";
import { PostsService } from "./posts.service";

@Controller("posts")
@ApiTags("Posts")
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get("list")
  @ApiOperation({
    summary: "全部文章",
  })
  // Query对象需要有orderBy, select, page, limit
  @ApiQuery({ name: "orderBy", required: false, description: "排序方式" })
  @ApiQuery({ name: "select", required: false, description: "选择字段" })
  @ApiQuery({ name: "page", required: false, description: "页码" })
  @ApiQuery({ name: "limit", required: false, description: "每页数量" })
  async list(@Query() query) {
    return await this.postsService.list(query);
  }

  @Get("random")
  @ApiOperation({
    summary: "随机文章",
  })
  @ApiQuery({ name: "index", required: false, description: "随机数量" })
  async random(@Query() query) {
    return await this.postsService.random(query.index);
  }

  @Get(":path")
  @ApiOperation({
    summary: "获取某篇文章",
  })
  @ApiParam({type: String, name: "path"})
  async findOne(@Param() params) {
    return this.postsService.findOne(params.slug, params.path);
  }

  @Post("send")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "发布文章",
  })
  @ApiBody({ type: CreatePostDto })
  async send(@Body() data) {
    // here is no need to filter XSS here
    // because this is user controller only
    return await this.postsService.send(data);
  }

  // 更新文章
  @Post("update")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("access-token")
  @ApiOperation({
    summary: "更新文章",
  })
  @ApiBody({ type: CreatePostDto })
  async update(@Body() data) {
    console.log(data);
    return await this.postsService.update(data);
  }

  @Delete("delete/:path")
  @ApiOperation({
    summary: "删除文章",
  })
  @ApiBearerAuth("access-token")
  @ApiParam({type: String, name: "path"})
  @UseGuards(AuthGuard("jwt"))
  async del(@Param() params) {
    return await this.postsService.del(params.path);
  }
  // if delete successfully, it will return affected = 1
}
