import { BadRequestException, HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "../../shared/entities/comments.entity";
import { CreateCommentsDto } from "../../shared/dto/create-comments-dto";
import BlockedKeywords = require("./block-keywords.json");
import { UsersService } from "../users/users.service";
import { delObjXss } from "utils/xss.util";
import { listProps } from "shared/interfaces/listProps";
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private CommentsRepository: Repository<Comments>,
    private usersService: UsersService
  ) {}


  async getComments(type: string, cid: number){
    return await this.CommentsRepository.find({
      type: type,
      cid: cid,
      status: 1,
    })
  }

  async list(query: listProps) {
    const select: (keyof Comments)[] = query.select ? query.select.split(",") as (keyof Comments)[] : ["coid", "text", "created", "author", "authorID", "owner", "ownerID", "email", "url", "status", "parent"];
    query.limit = query.limit ? query.limit : 10;
    query.page = query.page ? query.page : 1;
    return {
      total: Math.ceil(await this.getNum() / query.limit),
      now: query.page,
      data: await this.CommentsRepository.find({
        skip: query.limit > 1 ? (query.page - 1) * query.limit : query.limit,
        take: query.limit,
        select: select,
        order: {
          coid: query.orderBy === 'ASC' ? 'ASC' : 'DESC',
        },
        where: query.where ? {
          [query.where.split(":")[0]]: query.where.split(":")[1]      
        } : {}
      })
    }
  }

  async getNum(status?: number) {
    return await this.CommentsRepository.count({
      where: status ? { status: status } : {},
    });
  }

  async changeComments(data: CreateCommentsDto) {
    // 更新评论
    return await this.CommentsRepository.update(data.cid, data);
  }

  async createComments(data: CreateCommentsDto) {
    const isBlock = [...BlockedKeywords].some((keyword) =>
      new RegExp(keyword, "ig").test(data.text)
    );
    const contentByte = Buffer.byteLength(data.text, "utf8");
    if (contentByte > 200000) { // 200KB
      Logger.warn(`检测到一条过长评论提交 ${contentByte} 字节`, "CommentsService");
      throw new BadRequestException("评论过长，请删减后再试")
    }
    if (data.text.length > 500) {
      Logger.warn(`检测到一条过长评论提交 ${data.text.length} 字`, "CommentsService");
      throw new BadRequestException("评论过长，请删减后再试")
    }
    data = delObjXss(data);
    if (isBlock) {
      Logger.warn(`检测到一条垃圾评论提交`, "CommentsService");
      throw new HttpException(
        "评论有敏感词，请检查后重新提交",
        HttpStatus.BAD_REQUEST
      );
    }
    const isMaster = await this.usersService.findOne(data.author);
    if (isMaster) {
      Logger.warn(`检测到一条伪造评论提交`, "CommentsService");
      throw new BadRequestException(
        '用户名与主人重名啦, 但是你好像并不是我的主人唉',
      )
    }
    return await this.CommentsRepository.save(data);
  }

  async deleteComments(cid) {
    return await this.CommentsRepository.delete({
      // Use a unique CID for deletion
      cid: cid,
    });
  }

  async test(data: CreateCommentsDto) {
    const isBlock = [...BlockedKeywords].some((keyword) =>
      new RegExp(keyword, "ig").test(data.text)
    );
    const contentByte = Buffer.byteLength(data.text, "utf8");
    if (contentByte > 200000) { // 200KB
      Logger.warn(`检测到一条过长评论提交 ${contentByte} 字节`, "CommentsService");
      throw new BadRequestException("评论过长，请删减后再试")
    }
    if (data.text.length > 500) {
      Logger.warn(`检测到一条过长评论提交 ${data.text.length} 字`, "CommentsService");
      throw new BadRequestException("评论过长，请删减后再试")
    }
    data = delObjXss(data);
    if (isBlock) {
      Logger.warn(`检测到一条垃圾评论提交`, "CommentsService");
      throw new HttpException(
        "评论有敏感词，请检查后重新提交",
        HttpStatus.BAD_REQUEST
      );
    }
    const isMaster = await this.usersService.findOne(data.author);
    if (isMaster) {
      Logger.warn(`检测到一条伪造评论提交`, "CommentsService");
      throw new BadRequestException(
        '用户名与主人重名啦, 但是你好像并不是我的主人唉',
      )
    }
    return data
  }
}
