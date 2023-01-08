import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { v4 } from 'uuid';
import { HttpService } from '~/libs/helper/src/helper.http.service';
import { InjectModel } from '~/shared/transformers/model.transformer';
import { FriendsModel, FriendStatus } from './friends.model';
import { JSDOM } from 'jsdom';
import { ConfigService } from '~/libs/config/src';
import { RpcException } from '@nestjs/microservices';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { nextTick } from 'process';
import { FeedParser } from '~/shared/utils';
import { isValidObjectId } from 'mongoose';
@Injectable()
export class FriendsService {
  constructor(
    @InjectModel(FriendsModel)
    private readonly friendsModel: ReturnModelType<typeof FriendsModel>,
    private readonly configService: ConfigService,
    private readonly https: HttpService,
  ) {}

  public get model() {
    return this.friendsModel;
  }

  private throwInvalidTokenException(): never {
    throw new RpcException({
      code: HttpStatus.UNAUTHORIZED,
      message: ExceptionMessage.FriendLinkTokenIsInvalid,
    });
  }

  private throwNotFoundException(): never {
    throw new RpcException({
      code: HttpStatus.NOT_FOUND,
      message: ExceptionMessage.FriendLinkIsNotExist,
    });
  }

  private async checkAlive(url: string) {
    try {
      const res = await this.https.axiosRef.get(url);
      return res.status === 200;
    } catch (error) {
      return false;
    }
  }

  private async parseDom(url: string) {
    const htmlString = await this.https.axiosRef
      .get(url)
      .then((res) => res.data);
    const dom = new JSDOM(htmlString);
    return dom;
  }

  /**
   * 自动检测是否互链, 基于友链页面是否有类似于 <a href="https://iucky.cn">wibus</a> 的链接
   * 因为有部分网站是无法获取到友链页面的, 所以这里只能做到大致的检测
   *
   * TODO：如果有更好的检测方法, 欢迎提出
   *
   * @param url 友链地址
   * @returns boolean
   */
  private async autoCheck(url: string) {
    if (!(await this.checkAlive(url))) {
      return false;
    }
    const dom = await this.parseDom(url);
    const document = dom.window.document;
    const myUrl = (await this.configService.get('site')).frontUrl;
    const siteName = (await this.configService.get('seo')).title;
    const link = document.querySelector(`a[href="${myUrl}"]`);
    if (!link) {
      return false;
    }
    const title = link.textContent || link.getAttribute('title') === siteName;
    if (!title) {
      return false;
    }
    return true;
  }

  private generateToken() {
    return v4();
  }

  /**
   * friends.get.list
   */
  async getList(group: string | undefined) {
    return this.friendsModel.find({
      group,
      status: FriendStatus.Approved,
    });
  }

  /**
   * friends.get.all.auth
   */
  async getAllByMaster(status: FriendStatus) {
    return this.friendsModel.find({
      status: status || FriendStatus.Approved,
    });
  }

  /**
   * Event: friend.create
   */
  async create(input: { data: FriendsModel; isMaster: boolean }) {
    if (!input.isMaster) {
      input.data.status = FriendStatus.Pending;
    }
    input.data.token = this.generateToken();
    const friend = await this.friendsModel.create(input.data);
    nextTick(async () => {
      friend.autoCheck = await this.autoCheck(input.data.link);
      await friend.save();
      Logger.warn(
        `${friend.name} 申请友链 - 互链检测: ${
          friend.autoCheck ? '通过' : '未通过'
        }`,
        FriendsService.name,
      );
    });
    return friend;
  }

  /**
   * Event: friend.get
   */
  async get(id: string) {
    if (!isValidObjectId(id)) {
      this.throwNotFoundException();
    }
    const friend = await this.friendsModel.findById(id);
    if (!friend) {
      this.throwNotFoundException();
    }
    return friend;
  }

  /**
   * Event: friend.put.auth.token
   */
  async update(
    id: string,
    data: FriendsModel,
    isMaster: boolean,
    token?: string,
  ) {
    const friend = await this.friendsModel.findById(id);
    if (!friend) {
      this.throwNotFoundException();
    }
    if (!isMaster) {
      if (!token) {
        this.throwInvalidTokenException();
      }
      if (token !== friend.token) {
        this.throwInvalidTokenException();
      }
      data.status = FriendStatus.Pending; // 友链方修改后, 状态必须变为待审核，防止下毒
    }
    return this.friendsModel.updateOne({ _id: id }, data);
  }

  /**
   * Event: friend.delete.auth.token
   */
  async delete(id: string, isMaster: boolean, token?: string) {
    const friend = await this.friendsModel.findById(id);
    if (!friend) {
      this.throwNotFoundException();
    }

    if (!isMaster) {
      if (!token) {
        return;
      }
      if (token !== friend.token) {
        this.throwInvalidTokenException();
      }
    }
    return this.friendsModel.findByIdAndDelete(id);
  }

  /**
   * friend.check.alive
   */
  async checkAliver() {
    const friends = await this.friendsModel.find();
    const result: {
      id: string;
      isAlive: boolean;
    }[] = [];
    for (const friend of friends) {
      const isAlive = await this.checkAlive(friend.link);
      result.push({ id: friend._id, isAlive });
    }
    return result;
  }

  /**
   * friend.analyse.autoCheck
   */
  async analyseAutoCheck(id: string) {
    const friend = await this.friendsModel.findById(id);
    if (!friend) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: ExceptionMessage.FriendLinkIsNotExist,
      });
    }
    const isAlive = await this.checkAlive(friend.link);
    if (!isAlive) {
      await this.friendsModel.findByIdAndUpdate(id, { autoCheck: false });
    }
    const isAutoCheck = await this.autoCheck(friend.verifyLink);
    if (!isAutoCheck) {
      await this.friendsModel.findByIdAndUpdate(id, { autoCheck: false });
      Logger.warn(`${friend.name} 互链检测: 未通过`, FriendsService.name);
    }
    await this.friendsModel.findByIdAndUpdate(id, { autoCheck: true });
    return isAutoCheck;
  }

  /**
   * friend.analyse.feed
   */
  async analyseFeed() {
    const friends = await this.friendsModel.find();
    // use nextTick to avoid blocking the event loop
    nextTick(async () => {
      for (const friend of friends) {
        if (!this.checkAlive(friend.link)) {
          Logger.warn(`${friend.name} 无法访问，跳过解析`, FriendsService.name);
          continue;
        }
        if (!friend.feed) {
          Logger.warn(
            `${friend.name} 未提供 feed 地址，跳过解析`,
            FriendsService.name,
          );
          continue;
        }
        const xml = await this.https.axiosRef
          .get(friend.feed)
          .then((res) => res.data);
        const feed = FeedParser(xml, friend.feedType);
        await this.friendsModel.findByIdAndUpdate(friend._id, {
          feedContent: feed,
        });
        Logger.log(`解析 ${friend.name} 订阅成功`, FriendsService.name);
      }
    });
  }
}
