import axios from 'axios'
import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { CreateLinks } from './friends.interface';
import { FriendsService } from './friends.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('friends')
@ApiTags('Friends')
export class FriendsController {
    constructor(private friendsService: FriendsService) {}

    @Post('send')
    @HttpCode(200)
    @ApiOperation({summary: '修改/添加友链'})
    pushLinks(@Body() data: CreateLinks){
        return this.friendsService.create(data)
        // return data.name
    }

    // @Get('check')
    // @ApiOperation({summary: '检查友链状态码'})
    // async getStatus(){
        // console.log(await this.friendsService.check())
        // return await this.friendsService.check()
    // }

}
