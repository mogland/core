import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "../../shared/entities/posts.entity";
import { Repository } from "typeorm";
import { Category } from "../../shared/entities/category.entity";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async findPost(slug: string): Promise<Posts[]> {
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

  async list(query: any) {
    switch (query.type) {
    case 'all':
      return await this.categoryRepository.find();
    case 'limit':
      let page = query.page
      if (page < 1 || isNaN(page)) {
        page = 1;
      }
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;
      return await this.categoryRepository.find({
        skip: skip,
        take: limit,
        order: {
          id: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
      });
    case 'num':
      return await this.categoryRepository.count();
    default:
      return await this.categoryRepository.find();
    }
  }

  async update(data: Category) {
    return await this.categoryRepository.update(data.id, data);
  }

  async findOne(slug: string) {
    return await this.categoryRepository.findOne({
      slug: slug,
    });
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

  // 删除分类
  async delete(id: number) {
    return await this.categoryRepository.delete(id);
  }
  
}
