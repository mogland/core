/*
 * @FilePath: /nest-server/pages/pages.service.ts
 * @author: Wibus
 * @Date: 2021-10-03 22:54:25
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-04 15:31:33
 * Coding With IU
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePagesDto } from './create-pages-dto';
import { Pages } from './pages.entity';

@Injectable()
export class PagesService {

    constructor(
        @InjectRepository(Pages)
        private pagesRepository: Repository<Pages>
    ){}

    async findOne(path: any): Promise<Pages> {
        return await this.pagesRepository.findOne({
            path: path
        })
    }

    async list(): Promise<Pages[]>{
        return await this.pagesRepository.find()
    }

    async send(data: CreatePagesDto): Promise<Pages | string>{
        let result = await this.pagesRepository.find({
            path: data.path
        })
        // console.log(result[0])
        // return await this.pagesRepository.save(data)
        if (result[0]) {
            return `{
                "statusCode": "403",
                 "message": "slug is already used",
                  "error": "Can't Save"
                }`
        }else{
            return await this.pagesRepository.save(data)
        }
        
    }
}
