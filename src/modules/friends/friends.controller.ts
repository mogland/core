import { BadRequestException, Body, Controller, Get, HttpCode, Post, Query, UseGuards } from "@nestjs/common";
import { CreateFriendsDto } from "../../shared/dto/create-friends-dto";
import { FriendsService } from "./friends.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("friends")
@ApiTags("Friends")
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post("send")
  @HttpCode(200)
  @ApiOperation({ summary: "修改/添加友链" })
  pushLinks(@Body() data: CreateFriendsDto) {
    return this.friendsService.create(data);
    // return data.name
  }

  @Post("update")
  @UseGuards(AuthGuard("jwt"))
  @HttpCode(200)
  updateLinks(@Body() data: CreateFriendsDto) {
    return this.friendsService.update(data.id, data);
  }

  @Get("list")
  @ApiOperation({ summary: "获取全部友链" })
  async list(@Query() query) {
    return await this.friendsService.list(query.type);
  }

  @Get('check')
  @ApiOperation({summary: '获取友链/某个链接的状态码'})
  async getStatus(@Query() query){
    // console.log(await this.friendsService.getStatus(query.url))
    // return await this.friendsService.getStatus(query.url)
    throw new BadRequestException('暂时不支持此功能')
  }
}
