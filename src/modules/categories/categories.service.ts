import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "../../shared/entities/posts.entity";
import { Repository } from "typeorm";
import { Categories } from "../../shared/entities/categories.entity";
import { listProps } from "shared/interfaces/listProps";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,

    @InjectRepository(Categories)
    private CategoriesRepository: Repository<Categories>
  ) {}

  async findPost(slug: string): Promise<Posts[]> {
    return await this.postsRepository.find({
      slug: slug,
    });
  }

  async create(data) {
    if (
      !(await this.CategoriesRepository.findOne({
        name: data.name,
        slug: data.slug,
      }))
    ) {
      return await this.CategoriesRepository.save(data);
    } else {
      throw new HttpException("Already Exist", HttpStatus.BAD_REQUEST);
    }
  }

  async list() {
    return await this.CategoriesRepository.find()
  }

  async getNum() {
    return await this.CategoriesRepository.count();
  }

  async findPosts(slug: string, path: string) {
    return await this.postsRepository.findOne({
      where: {
        slug: slug,
        path: path,
      },
    });
  }

  async update(data: Categories) {
    return await this.CategoriesRepository.update(data.id, data);
  }

  async findOne(slug: string) {
    return await this.CategoriesRepository.findOne({
      slug: slug,
    });
  }

  async check(slug: string) {
    const data = await this.CategoriesRepository.findOne({
      slug: slug,
    });
    if (data) {
      return 1;
    } else {
      return 0;
    }
  }

  // 删除分类
  async delete(id: number) {
    return await this.CategoriesRepository.delete(id);
  }
  
}
