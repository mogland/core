import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
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

}
