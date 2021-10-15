import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import delXss from 'common/utils/xss';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './create-comment-dto';

@Controller('comment')
@ApiTags("Comment")
export class CommentController {

    constructor(
        private commentService: CommentService
    ){}

    @Get(":type/:path")
    @ApiOperation({
        summary: "获取文章/页面中的评论"
    })
    async get(@Param() param){
        return await this.commentService.getComment(param.type, param.path)
    }

    @Post("create")
    @ApiOperation({
        summary: "发布评论"
    })
    async create(@Body() data: CreateCommentDto){
        data.author = delXss(data.author)
        data.url = delXss(data.url)
        data.content = delXss(data.content)
        data.email = delXss(data.email)
        return await this.commentService.createComment(data)
    }

    @Post("delete")
    @ApiOperation({
        summary: "删除评论"
    })
    @UseGuards(AuthGuard('jwt'))
    async delete(@Body() data){
        return await this.commentService.deleteComment(data.cid)
    }
    
}
