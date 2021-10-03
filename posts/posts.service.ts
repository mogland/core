/*
 * @FilePath: /nest-server/posts/posts.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-03 23:04:33
 * Coding With IU
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from './posts.entity';

@Injectable()
export class PostsService {

    constructor(
        @InjectRepository(Posts)
        private postsRepository: Repository<Posts>
    ){}

    async list(): Promise<Posts[]>{
        return await this.postsRepository.find()
    }
}
