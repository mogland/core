import axios from 'axios'
import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { CreateLinks } from 'interface/friends.interface';
import { FriendsService } from '../services/friends.service';

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
        // console.log(await this.friendsService.check())
        return await this.friendsService.check()
    }

}
