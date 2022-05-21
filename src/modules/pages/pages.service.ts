/*
 * @FilePath: /ns-server/src/modules/pages/pages.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2022-05-21 20:00:18
 * Coding With IU
 */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { listProps } from "shared/interfaces/listProps";
import { Repository } from "typeorm";
import { CreatePagesDto } from "../../shared/dto/create-pages-dto";
import { Pages } from "../../shared/entities/pages.entity";

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

  async all() {
    return await this.pagesRepository.find();
  }

  async list(query?: listProps) {
    const select: (keyof Pages)[] = query.select ? query.select.split(",") as (keyof Pages)[] : ["id", "title", "path", "content", "createdAt", "updatedAt"];
    query.limit = query.limit ? query.limit : 10;
    query.page = query.page ? query.page : 1;
    return {
      total: Math.ceil(await this.getNum() / query.limit),
      now: query.page,
      data: await this.pagesRepository.find({
        skip: query.limit > 1 ? (query.page - 1) * query.limit : query.limit,
        take: query.limit,
        select: select,
        order: {
          id: query.orderBy === 'ASC' ? 'ASC' : 'DESC',
        },
        where: query.where ? {
          [query.where.split(":")[0]]: query.where.split(":")[1]      
        } : {}
      })
    }
  }

  async getNum() {
    return await this.pagesRepository.count();
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
