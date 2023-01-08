import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FriendsEvents } from '~/shared/constants/event.constant';
import { FriendsService } from './friends-service.service';
import { FriendsModel, FriendStatus } from './friends.model';

@Controller()
export class FriendsServiceController {
  constructor(private readonly friendsService: FriendsService) {}

  @MessagePattern({ cmd: FriendsEvents.FriendsGetList })
  async getFriendsList(group: string | undefined) {
    return await this.friendsService.getList(group);
  }

  @MessagePattern({ cmd: FriendsEvents.FriendsGetAllByMaster })
  async getAllFriends(status: FriendStatus) {
    return await this.friendsService.getAllByMaster(status);
  }

  @MessagePattern({ cmd: FriendsEvents.FriendGet })
  async getFriend(id: string) {
    return await this.friendsService.get(id);
  }

  @MessagePattern({ cmd: FriendsEvents.FriendCreate })
  async createFriend(data: FriendsModel, isMaster: boolean) {
    return await this.friendsService.create(data, isMaster);
  }

  @MessagePattern({ cmd: FriendsEvents.FriendUpdateByMasterOrToken })
  async updateFriend(input: {
    id: string;
    data: FriendsModel;
    isMaster: boolean;
    token?: string;
  }) {
    return await this.friendsService.update(
      input.id,
      input.data,
      input.isMaster,
      input.token,
    );
  }

  @MessagePattern({ cmd: FriendsEvents.FriendDeleteByMasterOrToken })
  async deleteFriend(input: { id: string; isMaster: boolean; token?: string }) {
    return await this.friendsService.delete(
      input.id,
      input.isMaster,
      input.token,
    );
  }

  @MessagePattern({ cmd: FriendsEvents.FriendsAnalyseFeed })
  async analyseFeed() {
    await this.friendsService.analyseFeed();
    return true;
  }

  @MessagePattern({ cmd: FriendsEvents.FriendAnalyseAutoCheck })
  async analyseAutoCheck(id: string) {
    return await this.friendsService.analyseAutoCheck(id);
  }

  @MessagePattern({ cmd: FriendsEvents.FriendsCheckAlive })
  async checkAlive() {
    return await this.friendsService.checkAliver();
  }
}
