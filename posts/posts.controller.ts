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
    @Get(':id')
    async findOne(@Param() params){
        return this.postsService.findOne(params.id)
    }
    @Post('send')
    @UseGuards(AuthGuard('jwt'))
    async send(@Body() content: CreatePostDto){
        // here is no need to filter XSS here
        // because this is user controller only
        return await this.postsService.send(content)
    }
}
