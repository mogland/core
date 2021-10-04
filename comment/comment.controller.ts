import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './create-comment-dto';

@Controller('comment')
export class CommentController {

    constructor(
        private commentService: CommentService
    ){}

    @Get(":type/:path")
    async get(@Param() param){
        return await this.commentService.getComment(param.type, param.path)
    }

    @Post("create")
    async create(@Body() data: CreateCommentDto[]){
        return await this.commentService.createComment(data)
    }

    @Post("delete")
    async delete(@Body() data){
        return await this.commentService.deleteComment(data.cid)
    }
    
}
