import { InjectModel } from '@app/db/model.transformer';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '~/processors/helper/helper.http.service';
import { ConfigsService } from '../configs/configs.service';
import { LinksModel, LinksStatus, LinksType } from './links.model';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel(LinksModel)
    private readonly linksModel: MongooseModel<LinksModel>,
    private readonly configs: ConfigsService,
    private readonly http: HttpService,
  ) {}

  public get model() {
    return this.linksModel;
  }

  /**
   * getCount 获取各项链接总数
   */
  async getCount() {
    const [audit, friends, collection, navigate, outdate, banned] = await Promise.all([
      this.model.countDocuments({ state: LinksStatus.Audit }),
      this.model.countDocuments({
        type: LinksType.Friend,
        state: LinksStatus.Pass,
      }),
      this.model.countDocuments({
        type: LinksType.Star,
      }),
      this.model.countDocuments({
        type: LinksType.Navigate,
      }),
      this.model.countDocuments({
        state: LinksStatus.Outdate,
      }),
      this.model.countDocuments({
        state: LinksStatus.Banned,
      }),
    ])
    return {
      audit, 
      friends, 
      collection, 
      navigate, 
      outdate, 
      banned
    }
  }

  /**
   * applyForFriendLink 申请好友链接
   * @param link 链接**模型**
   */
  async applyForFriendLink(link: LinksModel) {
    try {
      const document = await this.model.create({
        ...link,
        status: LinksStatus.Audit,
        types: LinksType.Friend,
      });
      return document
    } catch (error) {
      throw new BadRequestException("不要重复搞事情哦～");
    }
  }

  /**
   * setFriendLinkStatus 设置好友链接状态
   * @param id 链接id
   */
  async setFriendLinkStatus(id: string, status: LinksStatus) {
    const doc = await this.model
      .findOneAndUpdate(
        { _id: id },
        {
          $set: { status: status ? status : LinksStatus.Pass }, // 默认审核通过
        },
      )
      .lean()

    if (!doc) {
      throw new NotFoundException()
    }

    return doc
  }

}
