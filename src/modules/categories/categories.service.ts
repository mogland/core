import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Posts } from "../../shared/entities/posts.entity";
import { Repository } from "typeorm";
import { Categories } from "../../shared/entities/categories.entity";
import { listProps } from "../../shared/interfaces/listProps";
import { PostsService } from "../../modules/posts/posts.service";
import { CommentsService } from "../../modules/comments/comments.service";

@Injectable()
export class CategoriesService {
  constructor(
    @Inject(forwardRef(() => PostsService))
    private postsService: PostsService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
    @InjectRepository(Categories)
    private CategoriesRepository: Repository<Categories>,
  ) {}

  async findPostInHazy(path: string): Promise<Posts[]> {
    return await this.postsService.findInPath(path);
  }

  async all(){
    return await this.CategoriesRepository.find();
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

  async findPost(slug: string, path: string) {
    return await this.postsService.findOne(slug, path);
  }

  async findPosts(slug: string) {
    return await this.postsService.findInSlug(slug);
  }

  async update(data: any) {
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
