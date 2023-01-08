import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  FriendsModel,
  FriendStatus,
} from '~/apps/friends-service/src/friends.model';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { IsMaster } from '~/shared/common/decorator/role.decorator';

@Controller('friends')
@ApiName
export class FriendsController {
  constructor() {}

  @Get('/')
  @ApiOperation({ summary: '获取所有友链' })
  async getAllFriends(@IsMaster() isMaster: boolean) {}

  @Post('/')
  @ApiOperation({ summary: '创建友链' })
  async createFriend(
    @Body() friend: FriendsModel,
    @IsMaster() isMaster: boolean,
  ) {}

  @Put('/:id')
  @ApiOperation({ summary: '更新友链' })
  async updateFriend(
    @Param('id') id: string,
    @Body() friend: FriendsModel,
    @IsMaster() isMaster: boolean,
  ) {}

  @Patch('/:id')
  @ApiOperation({ summary: '更新友链状态' })
  async updateFriendStatus(
    @Param('id') id: string,
    @Query('status') status: FriendStatus,
  ) {}

  @Delete('/:id')
  @ApiOperation({ summary: '删除友链' })
  async deleteFriend(@Param('id') id: string) {}
}
