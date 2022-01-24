/*
 * @FilePath: /GS-server/src/modules/posts/posts.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-25 01:06:31
 * Coding With IU
 */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryService } from "../category/category.service";
import { Repository } from "typeorm";
import { CreatePostDto } from "../../shared/dto/create-post-dto";
import { Posts } from "../../shared/entities/posts.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    private categodyService: CategoryService
  ) {}

  async findOne(path: any): Promise<Posts> {
    return await this.postsRepository.findOne({
      path: path,
    });
  }

  async list(query: any) {
    switch (query.type) {
    case 'all':
      return await this.postsRepository.find();
    case 'limit':
      let page = query.page
      if (page < 1 || isNaN(page)) {
        page = 1;
      }
      const limit = 10;
      const skip = (page - 1) * limit;
      return await this.postsRepository.find({
        skip: skip,
        take: limit,
        select: ["id", "title", "path", "tags", "slug"],
      });
    case 'num':
      return await this.postsRepository.count();
    case 'list':
      return await this.postsRepository.find({
        select: ['id', 'title', 'path', 'tags', 'slug'],
      });
    default:
      return await this.postsRepository.find();
    }
  }

  async send(data: CreatePostDto): Promise<Posts | string> {
    const result = await this.postsRepository.findOne({
      path: data.path,
    });
    // console.log(result[0])
    // return await this.postsRepository.save(data)
    if (result) {
      throw new HttpException("Already Exist", HttpStatus.BAD_REQUEST);
    } else if (!this.categodyService.check(data.slug)) {
      throw new HttpException("Category Not Found", HttpStatus.BAD_REQUEST);
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
