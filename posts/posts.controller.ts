import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
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
    @UseGuards(AuthGuard('jwt'))
    async show(){
        return 
    }
}
