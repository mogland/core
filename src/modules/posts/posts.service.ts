/*
 * @FilePath: /ns-server/src/modules/posts/posts.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2022-05-15 20:09:41
 * Coding With IU
 */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoriesService } from "../categories/categories.service";
import { Repository } from "typeorm";
import { CreatePostDto } from "../../shared/dto/create-post-dto";
import { Posts } from "../../shared/entities/posts.entity";
import { listProps } from "shared/interfaces/listProps";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    private categodyService: CategoriesService
  ) {}

  async findOne(path: any): Promise<Posts> {
    return await this.postsRepository.findOne({
      path: path,
    });
  }

  async list(query: listProps) {
    const select: (keyof Posts)[] = query.select ? query.select.split(",")  as (keyof Posts)[] : ["id", "title", "path", "slug", "createdAt", "updatedAt", "content"];
    query.limit = query.limit ? query.limit : 10;
    query.page = query.page ? query.page : 1;
    return {
      total: Math.ceil(await this.getNum() / query.limit),
      now: query.page,
      data: await this.postsRepository.find({
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
    return await this.postsRepository.count();
  }

  async random(index: number) {
    // index 随机数量
    return await this.postsRepository.find({
      skip: Math.floor(Math.random() * (await this.getNum())),
      take: index ? index : 1,
    });
  }

  // async list(query: any) {
  //   switch (query.type) {
  //   case 'all':
  //     return await this.postsRepository.find({
  //       order: {
  //         id: query.order === 'ASC' ? 'ASC' : 'DESC',
  //       },
  //     });
  //   case 'limit':
  //     let page = query.page
  //     if (page < 1 || isNaN(page)) {
  //       page = 1;
  //     }
  //     const limit = query.limit || 10;
  //     const skip = (page - 1) * limit;
  //     return await this.postsRepository.find({
  //       skip: skip,
  //       take: limit,
  //       select: ["id", "title", "path", "tags", "slug"],
  //       order: {
  //         id: query.order === 'ASC' ? 'ASC' : 'DESC',
  //       },
  //     });
  //   case 'num':
  //     return await this.postsRepository.count();
  //   case 'list':
  //     return await this.postsRepository.find({
  //       select: ['id', 'title', 'path', 'tags', 'slug'],
  //       order: {
  //         id: query.order === 'ASC' ? 'ASC' : 'DESC',
  //       },
  //     });
  //   default:
  //     return await this.postsRepository.find({
  //       order: {
  //         id: query.order === 'ASC' ? 'ASC' : 'DESC',
  //       }
  //     });
  //   }
  // }

  async send(data: CreatePostDto){
    const result = await this.postsRepository.findOne({
      path: data.path,
    });
    // console.log(result[0])
    // return await this.postsRepository.save(data)
    if (result) {
      throw new HttpException("Already Exist", HttpStatus.BAD_REQUEST);
    } else if (!this.categodyService.check(data.slug)) {
      throw new HttpException("Categories Not Found", HttpStatus.BAD_REQUEST);
    } else {
      return await this.postsRepository.save(data);
    }
  }
  
  // 更新文章
  async update(data: CreatePostDto) {
    return await this.postsRepository.update(data.id,data);
  }

  // 删除文章（需要id）
  async del(id: number) {
    return await this.postsRepository.delete({
      id: id,
    });
  }
}
