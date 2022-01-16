import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
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
      throw new HttpException("Already Exist", HttpStatus.BAD_REQUEST);
    }
  }

  async list(page: number) {
    if (page < 1 || isNaN(page)) {
      page = 1;
    }
    const limit = 10;
    const skip = (page - 1) * limit;
    const data = await this.categoryRepository.find({
      skip: skip,
      take: limit,
    });
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
