/*
 * @FilePath: /GS-server/src/posts/posts.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-23 08:47:02
 * Coding With IU
 */
import { Injectable } from "@nestjs/common";
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
      return `{
                "statusCode": "403",
                 "message": "slug is already used",
                  "error": "Can't Save"
                }`;
    } else if (!this.categodyService.check(data.slug)) {
      //if it hasn't value
      return `{
                "statusCode": "403",
                 "message": "category can't find",
                  "error": "Can't Save"
                }`;
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
