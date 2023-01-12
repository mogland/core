import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { FriendsEvents } from '~/shared/constants/event.constant';
import { FriendsService } from './friends-service.service';
import { FriendsModel, FriendStatus } from './friends.model';

@Controller()
export class FriendsServiceController {
  constructor(private readonly friendsService: FriendsService) {}

  @MessagePattern({ cmd: FriendsEvents.FriendsGetList })
  @MessagePattern({ cmd: FriendsEvents.FriendsGetAll })
  async getFriendsList(group: string | undefined | Object) {
    const theGroup = group ? (group === Object ? undefined : group) : undefined;
    return await this.friendsService.getList(String(theGroup));
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
  async createFriend(data: { data: FriendsModel; isMaster: boolean }) {
    return await this.friendsService.create(data);
  }

  @MessagePattern({ cmd: FriendsEvents.FriendsGetFeeds })
  async getFeeds() {
    return await this.friendsService.getFeeds();
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

  @MessagePattern({ cmd: FriendsEvents.FriendPatchStatusByMaster })
  async patchFriendStatusByMaster(input: { id: string; status: FriendStatus }) {
    return await this.friendsService.patchStatusByMaster(
      input.id,
      input.status,
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
