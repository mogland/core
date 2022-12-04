import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from '~/shared/transformers/model.transformer';
import { FriendsBasicModel, FriendStatus } from './friends.basic.model';

@Injectable()
export class FriendsBasicService {
  constructor(
    @InjectModel(FriendsBasicModel)
    private readonly friendsBasicModel: ReturnModelType<
      typeof FriendsBasicModel
    >,
  ) {}

  get model() {
    return this.friendsBasicModel;
  }

  async getAllFriends(isMaster: boolean) {
    return await this.friendsBasicModel.find({
      status: !isMaster && FriendStatus.Approved,
    });
  }

  async createFriend(friend: FriendsBasicModel, isMaster: boolean) {
    if (!isMaster) {
      friend.status = FriendStatus.Pending;
    }
    return await this.friendsBasicModel.create(friend);
  }

  async updateFriend(id: string, friend: FriendsBasicModel, isMaster: boolean) {
    if (!isMaster) {
      friend.status = FriendStatus.Pending;
    }
    return await this.friendsBasicModel.findByIdAndUpdate(id, friend);
  }

  async updateFriendStatus(id: string, status: FriendStatus) {
    return await this.friendsBasicModel.findByIdAndUpdate(id, { status });
  }

  async deleteFriend(id: string) {
    return await this.friendsBasicModel.findByIdAndDelete(id);
  }
}
