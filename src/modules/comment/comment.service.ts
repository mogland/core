import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "./comment.entity";
import { CreateCommentDto } from "../../shared/dto/create-comment-dto";
import BlockedKeywords = require("./block-keywords.json");
const word = BlockedKeywords;
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private commentRepository: Repository<Comments>
  ) {}

  async getComment(type: string, path: string): Promise<Comments[]> {
    return await this.commentRepository.find({
      type: type,
      path: path,
    });
  }

  async list(page: number) {
    let data;
    if (page < 1){
      page = 1;
    }
    let limit = 10;
    data = await this.commentRepository.find({
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return data;
  }

  async changeComment(cid: number, state: number, content: string) {
    return await this.commentRepository.update(
      {
        cid: cid,
      },
      {
        content: content,
        state: state,
      }
    );
  }

  async createComment(data: CreateCommentDto) {
    // `data` must meet the following conditions:
    // type, path, content, author, owner, isOwner(if isn't admin, you can ignore this), email
    const isBlock = [...word].some((keyword) =>
      new RegExp(keyword, "ig").test(data.content)
    );
    if (isBlock) {
      throw new HttpException(
        "Your comment contains blocked words",
        HttpStatus.BAD_REQUEST
      );
    } else {
      return await this.commentRepository.save(data);
    }
  }

  async deleteComment(cid) {
    return await this.commentRepository.delete({
      // Use a unique CID for deletion
      cid: cid,
    });
  }
}
