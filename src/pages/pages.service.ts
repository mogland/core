/*
 * @FilePath: /GS-server/src/pages/pages.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-23 08:46:42
 * Coding With IU
 */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePagesDto } from "./create-pages-dto";
import { Pages } from "./pages.entity";

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Pages)
    private pagesRepository: Repository<Pages>
  ) {}

  async findOne(path: any): Promise<Pages> {
    return await this.pagesRepository.findOne({
      path: path,
    });
  }

  async list(type) {
    let data;
    if (type == "num") {
      data = await this.pagesRepository.count();
    } else {
      data = await this.pagesRepository.find();
      for (let index = 0; index < data.length; index++) {
        delete data[index].content;
      }
    }
    return data;
  }

  async send(data: CreatePagesDto): Promise<Pages | string> {
    const result = await this.pagesRepository.find({
      path: data.path,
    });
    // console.log(result[0])
    // return await this.pagesRepository.save(data)
    if (result[0]) {
      // TODO: 改变这里的不合理输出
      return `{
                "statusCode": "403",
                 "message": "slug is already used",
                  "error": "Can't Save"
                }`;
    } else {
      return await this.pagesRepository.save(data);
    }
  }

  async del(path) {
    return await this.pagesRepository.delete({
      path: path,
    });
  }
}
