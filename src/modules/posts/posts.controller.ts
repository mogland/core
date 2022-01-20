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
  // Query对象需要有limit属性, page属性
  @ApiQuery({name: "type", required: false, description: "查询参数", type: String, enum: ["all",'limit','num','list']})
  @ApiQuery({name: "page", required: false, description: "当type等于limit时的页码数", type: Number})
  async list(@Query() query) {
    return await this.postsService.list(query);
  }

  @Get(":path")
  @ApiOperation({
    summary: "获取某篇文章",
  })
  @ApiParam({type: String, name: "path"})
  async findOne(@Param() params) {
    return this.postsService.findOne(params.path);
  }

  @Post("send")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @ApiOperation({
    summary: "发布文章",
  })
  @ApiBody({ type: CreatePostDto })
  async send(@Body() data: CreatePostDto) {
    // here is no need to filter XSS here
    // because this is user controller only
    return await this.postsService.send(data);
  }

  @Delete("delete/:path")
  @ApiOperation({
    summary: "删除文章",
  })
  @ApiBearerAuth()
  @ApiParam({type: String, name: "path"})
  @UseGuards(AuthGuard("jwt"))
  async del(@Param() params) {
    return await this.postsService.del(params.path);
  }
  // if delete successfully, it will return affected = 1
}
