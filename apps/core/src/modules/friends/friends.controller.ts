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
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { IsMaster } from '~/shared/common/decorator/role.decorator';
import { FriendsBasicModel, FriendStatus } from './friends.basic.model';
import { FriendsBasicService } from './friends.basic.service';

@Controller('friends')
@ApiName
export class FriendsController {
  constructor(private readonly friendsBasicService: FriendsBasicService) {}

  @Get('/')
  @ApiOperation({ summary: '获取所有友链' })
  async getAllFriends(@IsMaster() isMaster: boolean) {
    return await this.friendsBasicService.getAllFriends(isMaster);
  }

  @Post('/')
  @ApiOperation({ summary: '创建友链' })
  async createFriend(
    @Body() friend: FriendsBasicModel,
    @IsMaster() isMaster: boolean,
  ) {
    return await this.friendsBasicService.createFriend(friend, isMaster);
  }

  @Put('/:id')
  @ApiOperation({ summary: '更新友链' })
  async updateFriend(
    @Param('id') id: string,
    @Body() friend: FriendsBasicModel,
    @IsMaster() isMaster: boolean,
  ) {
    return await this.friendsBasicService.updateFriend(id, friend, isMaster);
  }

  @Patch('/:id')
  @ApiOperation({ summary: '更新友链状态' })
  async updateFriendStatus(
    @Param('id') id: string,
    @Query('status') status: FriendStatus,
  ) {
    return await this.friendsBasicService.updateFriendStatus(id, status);
  }

  @Delete('/:id')
  @ApiOperation({ summary: '删除友链' })
  async deleteFriend(@Param('id') id: string) {
    return await this.friendsBasicService.deleteFriend(id);
  }
}
