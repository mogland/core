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

import { CommentService } from "./comment.service";
import { CreateCommentDto } from "../../shared/dto/create-comment-dto";
import { delObjXss } from "utils/xss.util";

@Controller("comment")
@ApiTags("Comment")
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get(":type/:path")
  @ApiOperation({
    summary: "获取文章/页面中的评论",
  })
  @ApiParam({ name: "type", required: true, description: "类型", type: String, enum: ["post", "page"] })
  @ApiParam({ name: "cid", required: true, description: "cid", type: String })
  async get(@Param() param) {
    return await this.commentService.getComment(param.type, param.cid);
  }

  @Get("list")
  @ApiOperation({
    summary: "获取全部评论",
  })
  @ApiQuery({name: "type", required: false, description: "查询参数", type: String, enum: ["all",'limit','num','list']})
  @ApiQuery({name: "page", required: false, description: "当type等于limit时的页码数", type: Number})
  async list(@Query() query) {
    return await this.commentService.list(query);
  }
  @Post("change")
  @ApiOperation({
    summary: "修改评论",
  })
  @UseGuards(AuthGuard("jwt"))
  @ApiBody({type: CreateCommentDto})
  @ApiBearerAuth("access-token")
  async change(@Body() data: CreateCommentDto) {
    return await this.commentService.changeComment(data);
  }

  @Post("create")
  @ApiOperation({
    summary: "发布评论",
  })
  async create(@Body() data: CreateCommentDto) {
    return await this.commentService.createComment(data);
  }

  @Delete("delete")
  @ApiOperation({
    summary: "删除评论",
  })
  // 只有一个cid属性
  @ApiBody({type: Number, description: "评论cid"})
  @ApiBearerAuth("access-token")
  @UseGuards(AuthGuard("jwt"))
  async delete(@Body() data) {
    return await this.commentService.deleteComment(data.cid);
  }
}
