import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './create-post-dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags("Posts")
export class PostsController {
    constructor(private postsService: PostsService){}

    @Get('list')
    @ApiOperation({
        summary: "全部文章"
    })
    async list(@Query() query){
        return await this.postsService.list(query.type)
    }

    @Get(':path')
    @ApiOperation({
        summary: "获取某篇文章"
    })
    async findOne(@Param() params){
        return this.postsService.findOne(params.path)
    }
    
    @Post('send')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: "发布文章"
    })
    async send(@Body() data: CreatePostDto){
        // here is no need to filter XSS here
        // because this is user controller only
        return await this.postsService.send(data)
    }

    @Get('delete/:path')
    @ApiOperation({
        summary: "删除文章"
    })
    @UseGuards(AuthGuard('jwt'))
    async del(@Param() params){
        return await this.postsService.del(params.path)
    }
    // if delete successfully, it will return affected = 1
}
