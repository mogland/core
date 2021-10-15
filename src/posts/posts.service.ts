/*
 * @FilePath: /GS-server/src/posts/posts.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-16 07:21:24
 * Coding With IU
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from 'category/category.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './create-post-dto';
import { Posts } from './posts.entity';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>,
        private categodyService: CategoryService
    ){}

    async findOne(path: any): Promise<Posts> {
        return await this.postsRepository.findOne({
            path: path
        })
    }

    async list(): Promise<Posts[]>{
        return await this.postsRepository.find()
    }

    async send(data: CreatePostDto): Promise<Posts | string>{
        let result = await this.postsRepository.findOne({
            path: data.path
        })
        // console.log(result[0])
        // return await this.postsRepository.save(data)
        if (result) {
            return `{
                "statusCode": "403",
                 "message": "slug is already used",
                  "error": "Can't Save"
                }`
        }else if(!await this.categodyService.check(data.slug)){ //if it hasn't value
            return `{
                "statusCode": "403",
                 "message": "category can't find",
                  "error": "Can't Save"
                }`
        }else{
            return await this.postsRepository.save(data)
        }
        
    }

    async del(path) {
        return await this.postsRepository.delete({
            path: path
        })
    }
}
