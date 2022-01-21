/*
 * @FilePath: /GS-server/src/modules/pages/pages.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-21 14:54:04
 * Coding With IU
 */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePagesDto } from "../../shared/dto/create-pages-dto";
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

  async list(query: any) {
    switch (query.type) {
    case 'all':
      return await this.pagesRepository.find();
    case 'limit':
      let page = query.page
      if (page < 1 || isNaN(page)) {
        page = 1;
      }
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;
      return await this.pagesRepository.find({
        skip: skip,
        take: limit,
      });
    case 'num':
      return await this.pagesRepository.count();
    case 'list':
      return await this.pagesRepository.find({
        select: ['id', 'title', 'path'],
      });
    default:
      return await this.pagesRepository.find();
    }


  }

  async send(data: CreatePagesDto){
    if (await this.pagesRepository.findOne({ path: data.path })) {
      // return restful api
      throw new HttpException("Already Exist", HttpStatus.BAD_REQUEST);
    } else {
      return await this.pagesRepository.save(data);
    }
  }

  async update(data: CreatePagesDto) {
    return await this.pagesRepository.update(data.id, data);
  }

  async del(path) {
    return await this.pagesRepository.delete({
      path: path,
    });
  }
}
