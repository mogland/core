import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import delXss from '../common/utils/xss';
import { Friends } from './friend.entry';
import { CreateFriendsDto } from './create-friends-dto';

@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Friends)
        private friendsRepository: Repository<Friends>
    ){}

    
    async create(data: CreateFriendsDto){
        // create data to database (todo)
        data.name = delXss(data.name)
        data.website = delXss(data.website)
        if (data.description != null) {
            data.description = delXss(data.description)    
        }
        if (data.image != null) {
            data.image = delXss(data.image)
        }
        if (data.check != null) {
            data.check = false
        }
        return await this.friendsRepository.save(data)
    }

    async list(type){
        let data
        if (type == 'num') {
            data = await this.friendsRepository.count()
        }else{
            data = await this.friendsRepository.find()
        }
        return data
    }
}
