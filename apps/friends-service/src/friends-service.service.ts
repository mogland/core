import { HttpStatus, Injectable } from '@nestjs/common';
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
  async getList(group: string) {
    return this.friendsModel.find({
      group,
      status: FriendStatus.Approved,
    });
  }

  /**
   * friends.get.all.auth
   */
  async getAllByMater(status: FriendStatus) {
    return this.friendsModel.find({
      status,
    });
  }

  /**
   * Event: friend.create
   */
  async create(data: FriendsModel, isMaster: boolean) {
    if (!isMaster) {
      data.status = FriendStatus.Pending;
    }
    data.token = this.generateToken();
    return this.friendsModel.create(data);
  }

  /**
   * Event: friend.get
   */
  async get(id: string) {
    return this.friendsModel.findById(id);
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
        return;
      }
      if (token !== friend.token) {
        this.throwInvalidTokenException();
      }
      data.status = FriendStatus.Pending;
    }
    return this.friendsModel.findByIdAndUpdate(id, data);
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
  async checkAliveByIds(id: string[]) {
    const friends = await this.friendsModel.find({ _id: { $in: id } });
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
  async autoChecker(id: string) {
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
    }
    return this.friendsModel.findByIdAndUpdate(id, { autoCheck: true });
  }

  /**
   * friend.analyse.feed
   */
  async feedAnalyse() {
    const friends = await this.friendsModel.find();
    // use nextTick to avoid blocking the event loop
    nextTick(async () => {
      for (const friend of friends) {
        if (!this.checkAlive(friend.link)) {
          continue;
        }
        if (!friend.feed) {
          continue;
        }
        const xml = await this.https.axiosRef
          .get(friend.feed)
          .then((res) => res.data);
        const feed = FeedParser(xml, friend.feedType);
        await this.friendsModel.findByIdAndUpdate(friend._id, {
          feedContent: feed,
        });
      }
    });
  }
}
