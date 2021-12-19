/*
 * @FilePath: /GS-server/src/posts/posts.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2021-12-19 08:00:35
 * Coding With IU
 */
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryService } from "category/category.service";
import { Repository } from "typeorm";
import { CreatePostDto } from "./create-post-dto";
import { Posts } from "./posts.entity";

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

  async list(type) {
    let data: any;
    if (type == "num") {
      data = this.postsRepository.count();
    } else {
      data = await this.postsRepository.find();

      for (let index = 0; index < data.length; index++) {
        delete data[index].content;
      }
    }
    return data;
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

  async del(path) {
    return await this.postsRepository.delete({
      path: path,
    });
  }
}
