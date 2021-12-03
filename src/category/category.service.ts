import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "../posts/posts.entity";
import { Repository } from "typeorm";
import { Category } from "./category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async find(slug: string): Promise<Posts[]> {
    return await this.postsRepository.find({
      slug: slug,
    });
  }

  async create(data) {
    if (
      !(await this.categoryRepository.findOne({
        name: data.name,
        slug: data.slug,
      }))
    ) {
      return await this.categoryRepository.save(data);
    } else {
      return `{
                "statusCode": "403",
                 "message": "category is already created",
                }`;
    }
  }

  async list(type) {
    let data;
    if (type == "num") {
      data = await this.categoryRepository.count();
    } else {
      data = await this.categoryRepository.find();
    }
    return data;
  }

  async check(slug: string) {
    const data = await this.categoryRepository.findOne({
      slug: slug,
    });
    if (data) {
      return 1;
    } else {
      return 0;
    }
  }
}
