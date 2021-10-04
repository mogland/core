import { Get, Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from './comment.entity';
import { CreateCommentDto } from './create-comment-dto';

@Injectable()
export class CommentService {

    constructor(
        @InjectRepository(Comments)
        private commentRepository: Repository<Comments>
    ){}

    async getComment(type: string, path: string): Promise<Comments[]>{
        return await this.commentRepository.find({
            type: type,
            path: path
        })
    }

    async createComment(data: CreateCommentDto[]): Promise<Comments[]>{
        // `data` must meet the following conditions:
        // type, path, content, author, owner, isOwner(if isn't admin, you can ignore this), email
        return await this.commentRepository.save(data)
    }

    async deleteComment(cid){
        return await this.commentRepository.delete({
            // Use a unique CID for deletion
            cid: cid
        })
    }
}
