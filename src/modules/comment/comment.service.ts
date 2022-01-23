import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "../../shared/entities/comment.entity";
import { CreateCommentDto } from "../../shared/dto/create-comment-dto";
import BlockedKeywords = require("./block-keywords.json");
import { UsersService } from "modules/users/users.service";
const word = BlockedKeywords;
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comments)
    private commentRepository: Repository<Comments>,
    private usersService: UsersService
  ) {}

  async getComment(type: string, cid: number): Promise<Comments[]> {
    return await this.commentRepository.find({
      type: type,
      cid: cid,
      state: 1,
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
    case 'uncheck':
      return await this.commentRepository.find({
        state: 0,
      });
    case 'uncheck_num':
      return await this.commentRepository.count({
        state: 0,
      });
    default:
      return await this.commentRepository.find()
    }
  }

  async changeComment(data: CreateCommentDto) {
    // 更新评论
    return await this.commentRepository.update(data.cid, data);
  }

  async createComment(data: CreateCommentDto) {
    // `data` must meet the following conditions:
    // type, path, content, author, owner, isOwner(if isn't admin, you can ignore this), email
    const isBlock = [...word].some((keyword) =>
      new RegExp(keyword, "ig").test(data.content)
    );
    const contentByte = Buffer.byteLength(data.content, "utf8");
    if (contentByte > 200000) { // 200KB
      throw new BadRequestException("评论过长，请删减后再试")
    }
    const isMaster = this.usersService.findOne(data.author);
    if (isMaster && data.isOwner != 1) {
      throw new BadRequestException(
        '用户名与主人重名啦, 但是你好像并不是我的主人唉',
      )
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
