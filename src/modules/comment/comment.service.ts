import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "../../shared/entities/comment.entity";
import { CreateCommentDto } from "../../shared/dto/create-comment-dto";
import BlockedKeywords = require("./block-keywords.json");
import { UsersService } from "../../modules/users/users.service";
import { delObjXss } from "utils/xss.util";
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
      return await this.commentRepository.find({
        order: {
          cid: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
      })
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
        order: {
          cid: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
      });
    case 'num':
      return await this.commentRepository.count()
    case 'uncheck':
      return await this.commentRepository.find({
        where: {
          state: 0,
        },
        order: {
          cid: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
      });
    case 'uncheck_num':
      return await this.commentRepository.count({
        state: 0,
      });
    default:
      return await this.commentRepository.find({
        order: {
          cid: query.order === 'ASC' ? 'ASC' : 'DESC',
        },
      })
    }
  }

  async changeComment(data: CreateCommentDto) {
    // 更新评论
    return await this.commentRepository.update(data.cid, data);
  }

  async createComment(data: CreateCommentDto) {
    const isBlock = [...BlockedKeywords].some((keyword) =>
      new RegExp(keyword, "ig").test(data.content)
    );
    const contentByte = Buffer.byteLength(data.content, "utf8");
    if (contentByte > 200000) { // 200KB
      Logger.warn(`检测到一条过长评论提交 ${contentByte} 字节`, "CommentService");
      throw new BadRequestException("评论过长，请删减后再试")
    }
    if (data.content.length > 500) {
      Logger.warn(`检测到一条过长评论提交 ${data.content.length} 字`, "CommentService");
      throw new BadRequestException("评论过长，请删减后再试")
    }
    data = delObjXss(data);
    if (isBlock) {
      Logger.warn(`检测到一条垃圾评论提交`, "CommentService");
      throw new HttpException(
        "评论有敏感词，请检查后重新提交",
        HttpStatus.BAD_REQUEST
      );
    }
    const isMaster = await this.usersService.findOne(data.author);
    if (isMaster && data.isOwner != 1) {
      Logger.warn(`检测到一条伪造评论提交`, "CommentService");
      throw new BadRequestException(
        '用户名与主人重名啦, 但是你好像并不是我的主人唉',
      )
    }
    return await this.commentRepository.save(data);
  }

  async deleteComment(cid) {
    return await this.commentRepository.delete({
      // Use a unique CID for deletion
      cid: cid,
    });
  }
}
