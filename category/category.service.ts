import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from 'posts/posts.entity';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>,
        
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ){}

    async find(slug: string): Promise<Posts[]> {
        return await this.postsRepository.find({
            slug: slug
        })
    }

    async create(name: string, slug: string){

    }


}
