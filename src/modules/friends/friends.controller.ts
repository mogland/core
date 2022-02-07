import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CreateFriendsDto } from "../../shared/dto/create-friends-dto";
import { FriendsService } from "./friends.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { IsMaster } from "../../common/decorator/user.decorator";

@Controller("friends")
@ApiTags("Friends")
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post("send")
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "添加友链" })
  @ApiBody({ type: CreateFriendsDto })
  @UseGuards(AuthGuard("jwt"))
  pushLinks(@Body() data: CreateFriendsDto, @IsMaster() ismaster: boolean) {
    return this.friendsService.create(data, ismaster);
    // return data.name
  }

  @Post("update")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "修改友链" })
  @ApiBearerAuth("access-token")
  @ApiBody({ type: CreateFriendsDto })
  updateLinks(@Body() data: CreateFriendsDto) {
    return this.friendsService.update(data.id, data);
  }

  @Delete("delete/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth("access-token")
  @ApiOperation({ summary: "删除友链" })
  @ApiParam({ name: "id", required: true, description: "友链id", type: Number })
  deleteLinks(@Param() params) {
    return this.friendsService.delete(params.id);
  }

  @Get("list")
  @ApiOperation({ summary: "获取全部友链" })
  @ApiQuery({name: "type", required: false, description: "查询参数", type: String, enum: ["all",'limit','num','list']})
  @ApiQuery({name: "page", required: false, description: "当type等于limit时的页码数", type: Number})
  async list(@Query() query) {
    return await this.friendsService.list(query);
  }
}
