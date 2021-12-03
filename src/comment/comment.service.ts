import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comments } from "./comment.entity";
import { CreateCommentDto } from "./create-comment-dto";
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

  async list(type) {
    let data;
    if (type == "num") {
      data = await this.commentRepository.count();
    } else {
      data = await this.commentRepository.find();
    }
    return data;
  }

  async createComment(data: CreateCommentDto) {
    // `data` must meet the following conditions:
    // type, path, content, author, owner, isOwner(if isn't admin, you can ignore this), email
    const isBlock = [...word].some((keyword) =>
      new RegExp(keyword, "ig").test(data.content)
    );
    if (isBlock) {
      return `{
                "statusCode": "403",
                 "message": "监测到垃圾评论",
                  "error": "Can't Save"
                }`;
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
