import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Friends } from "../../shared/entities/friends.entity";
import { CreateFriendsDto } from "../../shared/dto/create-friends-dto";
import { GHttp } from "../../../helper/helper.http.service";
import { delObjXss } from "utils/xss.util";
import rssParser from "utils/rss.utils";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,
    private readonly http: GHttp
  ) {}

  async create(data: CreateFriendsDto, ismaster: boolean) {
    data = delObjXss(data);
    if (data.image == null) {
      data.image = "";
    }
    if (data.check != null) {
      data.check = 0;
    }
    if (data.owner == null) {
      data.owner = 0;
    }
    if (ismaster) {
      data.check = 1;
    }
    if (await this.friendsRepository.findOne({ name: data.name })) {
      throw new HttpException("已存在这位朋友啦", HttpStatus.BAD_REQUEST);
    }
    return await this.friendsRepository.save(data);
  }

  // 修改友链
  async update(id, data) {
    data = delObjXss(data);
    // console.log(data.check)
    return await this.friendsRepository.update(id, data);
  }

  async list(query: any) {
    switch (query.type) {
    case "all":
      return await this.friendsRepository.find({
        order: {
          id: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
        where: {
          check: 1,
        }
      });
    case 'true-all':
      return await this.friendsRepository.find({
        order: {
          id: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
      });
    case "limit":
      let page = query.page
      if (page < 1 || isNaN(page)) {
        page = 1;
      }
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;
      return await this.friendsRepository.find({
        skip: skip,
        take: limit,
        order: {
          id: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
      });
    case "num":
      return await this.friendsRepository.count();
    case "uncheck":
      return await this.friendsRepository.find({
        where: {
          check: 0,
        }
      });
    case "uncheck_num":
      return await this.friendsRepository.count({
        check: 0,
      });
    default:
      return await this.friendsRepository.find({
        order: {
          id: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
        where: {
          check: 1,
        }
      });
    }
  }

  async spider(url: string) {
    const rssContent = await this.http.axiosRef
      .get(url, {
        timeout: 5000,
        'axios-retry': {
          retries: 1,
          shouldResetTimeout: true,
        },
      })
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        return {
          ok: false,
          mes: err.message,
        }
      })
    return rssParser(rssContent);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM, {name: 'updateFriendsRSS'})
  async updateRSS() {
    const FriendData = await this.friendsRepository.find()
    Logger.log("开始更新友链RSS", FriendsService.name)
    await this.updateRSSContent(FriendData)
  }

  async updateRSSContent(element: Array<Friends>) {
    const request = element.map(async (element) => {
      if (element.rss) {
        const rss = await this.spider(element.rss) // 获取到RSS内容
        const data = rss.items // 仅摘取文章信息
        if (data.length > 0) {
          // 将data放入rssContent字段，更新数据库
          const rssContent = JSON.stringify(data)
          await this.friendsRepository.update(element.id, { rssContent })
          Logger.log(`${element.name} RSS更新成功`, FriendsService.name)
        }else {
          Logger.log(`${element.name} RSS更新失败`, FriendsService.name)
        }
      }else{
        Logger.log(`${element.name} 无RSS链接`, FriendsService.name)
      }
    })
    return Promise.all(request)
  }

  // 删除友链
  async delete(id: number) {
    return await this.friendsRepository.delete(id);
  }
}
