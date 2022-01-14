import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import delXss from "../../utils/xss.util";
import { Friends } from "./friends.entity";
import { CreateFriendsDto } from "../../shared/dto/create-friends-dto";
import axios from "axios";

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>
  ) {}

  async create(data: CreateFriendsDto) {
    data.name = delXss(data.name);
    
    data.website = delXss(data.website);
    if (data.description != null) {
      data.description = delXss(data.description);
    }
    if (data.image != null) {
      data.image = delXss(data.image);
    }else{
      data.image = "";
    }
    if (data.check != null) {
      data.check = false;
    }
    if (data.owner == null) {
      data.owner = false;
    }
    if (data.check == null) {
      data.check = false;
    }
    if (await this.friendsRepository.findOne({ name: data.name })) {
      throw new HttpException("已存在这位朋友啦", HttpStatus.BAD_REQUEST);
    }
    return await this.friendsRepository.save(data);
  }

  // 修改友链
  async update(id, data) {
    data.name = delXss(data.name);
    data.website = delXss(data.website);
    if (data.description != null) {
      data.description = delXss(data.description);
    }
    if (data.image != null) {
      data.image = delXss(data.image);
    }
    // console.log(data.check)
    return await this.friendsRepository.update(id, data);
  }

  async list(type) {
    let data;
    if (type == "num") {
      data = await this.friendsRepository.count();
    } else {
      data = await this.friendsRepository.find();
    }
    return data;
  }

  // 获取baidu.com状态码
  async getStatus(url: string) {
    const status = await axios.get(url);
    return status.status;
  }
}
