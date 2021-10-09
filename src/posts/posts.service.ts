/*
 * @FilePath: /nest-server/posts/posts.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-04 15:20:00
 * Coding With IU
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './create-post-dto';
import { Posts } from './posts.entity';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>
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
        let result = await this.postsRepository.find({
            path: data.path
        })
        // console.log(result[0])
        // return await this.postsRepository.save(data)
        if (result[0]) {
            return `{
                "statusCode": "403",
                 "message": "slug is already used",
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
