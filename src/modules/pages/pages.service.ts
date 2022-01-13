/*
 * @FilePath: /GS-server/src/modules/pages/pages.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-13 22:49:34
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

  async send(data: CreatePagesDto){
    if (await this.pagesRepository.findOne({ path: data.path })) {
      // return restful api
      throw new HttpException("Already Exist", HttpStatus.BAD_REQUEST);
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
