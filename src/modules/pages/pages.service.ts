/*
 * @FilePath: /nx-server/src/modules/pages/pages.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-06 22:29:54
 * Coding With IU
 */
import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentsService } from "../../modules/comments/comments.service";
import { listProps } from "../../shared/interfaces/listProps";
import { Repository } from "typeorm";
import { CreatePagesDto } from "../../shared/dto/create-pages-dto";
import { Pages } from "../../shared/entities/pages.entity";

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Pages)
    private pagesRepository: Repository<Pages>,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService
  ) {}

  async findOne(path: any): Promise<Pages> {
    // 数据库view字段+1
    await this.pagesRepository.increment({
      path: path,
    }, "views", 1);
    const data = await this.pagesRepository.findOne({
      path: path,
    }) as any
    const comments = await this.commentsService.getComments("page", data.id)
    data.comments = comments.length
    return data
  }

  async all() {
    return await this.pagesRepository.find();
  }
  async thumbUp(path: string) {
    return await this.pagesRepository.increment({ path: path }, "thumbs", 1);
  }

  async list(query: listProps) {
    const select: (keyof Pages)[] = query.select ? query.select.split(",") as (keyof Pages)[] : ["id", "title", "path", "content", "createdAt", "updatedAt"];
    query.limit = query.limit ? query.limit : 10;
    query.page = query.page ? query.page : 1;
    let data = await this.pagesRepository.find({
      skip: query.limit > 1 ? (query.page - 1) * query.limit : query.limit,
      take: query.limit,
      select: select,
      order: {
        id: query.orderBy === 'ASC' ? 'ASC' : 'DESC',
      },
      where: query.where ? {
        [query.where.split(":")[0]]: query.where.split(":")[1]      
      } : {}
    }) as any
    data =  data.map(async (item) => {
      const commentNum = await this.commentsService.getComments("post", item.id) as any
      item.comments = commentNum.length
      return item
    }) 
    data = await Promise.all(data)
    return {
      total: Math.ceil(await this.getNum() / query.limit),
      now: query.page,
      data: data
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
