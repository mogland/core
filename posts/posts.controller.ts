import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './create-post-dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags("Posts")
export class PostsController {
    constructor(private postsService: PostsService){}
    @Get('list')
    async list(){
        return this.postsService.list()
    }

    @Get(':path')
    async findOne(@Param() params){
        return this.postsService.findOne(params.path)
    }
    
    @Post('send')
    // @UseGuards(AuthGuard('jwt'))
    async send(@Body() data: CreatePostDto){
        // here is no need to filter XSS here
        // because this is user controller only
        return await this.postsService.send(data)
    }

    @Get('delete/:path')
    // @UseGuards(AuthGuard('jwt'))
    async del(@Param() params){
        return await this.postsService.del(params.path)
    }
    // if delete successfully, it will return affected = 1
}
