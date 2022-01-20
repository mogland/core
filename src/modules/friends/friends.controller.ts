import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { CreateFriendsDto } from "../../shared/dto/create-friends-dto";
import { FriendsService } from "./friends.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("friends")
@ApiTags("Friends")
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post("send")
  @ApiOperation({ summary: "添加友链" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateFriendsDto })
  @UseGuards(AuthGuard("jwt"))
  pushLinks(@Body() data: CreateFriendsDto) {
    return this.friendsService.create(data);
    // return data.name
  }

  @Post("update")
  @UseGuards(AuthGuard("jwt"))
  @ApiOperation({ summary: "修改友链" })
  @ApiBearerAuth()
  @ApiBody({ type: CreateFriendsDto })
  updateLinks(@Body() data: CreateFriendsDto) {
    return this.friendsService.update(data.id, data);
  }

  @Delete("delete/:id")
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
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

  @Get('check')
  @ApiOperation({summary: '获取友链/某个链接的状态码(TODO)'})
  async getStatus(){
    // console.log(await this.friendsService.getStatus(query.url))
    // return await this.friendsService.getStatus(query.url)
    throw new BadRequestException('暂时不支持此功能')
  }
}
