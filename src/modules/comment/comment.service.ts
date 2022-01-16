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

  async list(query: any) {
    switch (query.type){
    case 'all':
      return await this.commentRepository.find()
    case 'limit':
      let page = query.page
      if (page < 1 || isNaN(page)) {
        page = 1;
      }
      const limit = query.limit || 10;
      const skip = (page - 1) * limit;
      return await this.commentRepository.find({
        skip: skip,
        take: limit,
      });
    case 'num':
      return await this.commentRepository.count()
    default:
      return await this.commentRepository.find()
    }
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
    const contentByte = Buffer.byteLength(data.content, "utf8");
    // 如果contentByte超过了1MB，则抛出异常
    if (contentByte > 1048576) {
      throw new HttpException(
        "评论过长，请删减后再试",
        HttpStatus.BAD_REQUEST
      );
    }
    if (isBlock) {
      throw new HttpException(
        "评论有敏感词，请检查后重新提交",
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
