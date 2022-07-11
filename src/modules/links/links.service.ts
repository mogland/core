import { InjectModel } from '@app/db/model.transformer';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import Parser from 'rss-parser';
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
   * @param status 状态
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

  /**
   * checkLinksHealth 检查链接的健康状态
   */
  async checkLinksHealth() {
    const links = await this.model.find({
      state: LinksStatus.Pass,
    }).lean()

    const health = await Promise.all(
      links.map(({ id, url }) => {
        Logger.debug(
          `检查友链 ${id} 的健康状态: GET -> ${url}`,
          LinksService.name,
        )
        return this.http.axiosRef
          .get(url, {
            timeout: 5000,
            'axios-retry': {
              retries: 1,
              shouldResetTimeout: true,
            },
          })
          .then((res) => {
            return {
              status: res.status,
              id,
            }
          })
          .catch((err) => {
            return {
              id,
              status: err.response?.status || 'ERROR',
              message: err.message,
            }
          })
      }),
    ).then((arr) =>
    arr.reduce((acc, cur) => {
      acc[cur.id] = cur // 将每个链接的健康状态放入对象中
      return acc 
    }, {}),
  )

    return health
  }

  async parseRSS(url: string){
    const parser: Parser = new Parser()
    const feed = await parser.parseURL(url)
    return feed
  }
}
