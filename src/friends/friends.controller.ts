import axios from 'axios'
import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { CreateLinks } from 'src/core/interface/friends.interface';
import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendsController {
    constructor(private friendsService: FriendsService) {}

    @Post('send')
    @HttpCode(200)
    pushLinks(@Body() data: CreateLinks){
        return this.friendsService.create(data)
        // return data.name
    }

    @Get('check')
    async getStatus(){
        // console.log(this.friendsService.check())
        // return this.friendsService.check()
        const $api = axios.create()
        $api
            .get('https://baidu.com')
            .then((response) => {console.warn(response.data); return response.data})
    }

}
