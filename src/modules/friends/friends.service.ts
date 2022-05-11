import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Friends } from "../../shared/entities/friends.entity";
import { CreateFriendsDto } from "../../shared/dto/create-friends-dto";
import { GHttp } from "../../helper/helper.http.service";
import { delObjXss } from "utils/xss.util";
import rssParser from "utils/rss.utils";
import { Cron, CronExpression } from "@nestjs/schedule";
import { listProps } from "shared/interfaces/listProps";

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

  async list(query: listProps) {
    const select: (keyof Friends)[] = query.select ? query.select.split(",") as (keyof Friends)[] : ["id", "name", "description", "website", "image", "check"];
    return await this.friendsRepository.findAndCount({
      skip: query.limit ? query.limit > 1 ? (query.page - 1) * query.limit : query.limit : undefined,
      take: query.limit ? query.limit : undefined,
      select: select,
      order: {
        id: query.orderBy === 'ASC' ? 'ASC' : 'DESC',
      },
      where: query.where ? {
        [query.where.split(":")[0]]: query.where.split(":")[1]      
      } : {}
    });
  }

  async getNum(state?: number) {
    return await this.friendsRepository.count({
      where: state ? { check: state } : {},
    });
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
