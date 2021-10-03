/*
 * @FilePath: /Nest-server/posts/posts.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-04 06:59:51
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

    async findOne(id: number[]): Promise<Posts[]> {
        return await this.postsRepository.findByIds(id)
    }
    async list(): Promise<Posts[]>{
        return await this.postsRepository.find()
    }
    async send(data: CreatePostDto): Promise<Posts>{
        return await this.postsRepository.save(data)
    }
}
