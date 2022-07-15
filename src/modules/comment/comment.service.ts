import { DbService } from "@app/db";
import { InjectModel } from "@app/db/model.transformer";
import BlockedKeywords from "./block-keywords.json";
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { BeAnObject, DocumentType } from "@typegoose/typegoose/lib/types";
import { ConfigsService } from "../configs/configs.service";
import { PageModel } from "../page/page.model";
import { PostModel } from "../post/post.model";
import { UserService } from "../user/user.service";
import { CommentModel, CommentType } from "./comment.model";
import { LeanDocument, Types } from "mongoose";
import { WriteBaseModel } from "~/shared/model/base.model";
import { CannotFindException } from "~/common/exceptions/cant-find.exception";
import { ToolsService } from "../tools/tools.service";
@Injectable()
export class CommentService {
  private readonly logger: Logger = new Logger(CommentService.name);

  constructor(
    @InjectModel(CommentModel)
    private readonly commentModel: MongooseModel<CommentModel>,
    private readonly dbService: DbService,
    private readonly configs: ConfigsService,
    private readonly userService: UserService,
    private readonly toolsService: ToolsService
  ) {}

  public get model() {
    return this.commentModel;
  }

  private getModelByRefType(
    refType: CommentType
  ): ReturnModelType<typeof PostModel | typeof PageModel, BeAnObject> {
    switch (refType) {
      case CommentType.Post:
        return this.dbService.getModelByRefType("post");
      case CommentType.Page:
        return this.dbService.getModelByRefType("page");
      default:
        throw new Error("refType is not supported");
    }
  }

  async checkBlock(comment: CommentModel) {
    const res = await (async () => {
      if (comment.author === (await this.userService.getMaster()).username) {
        return false;
      }
      const isBlock = [...BlockedKeywords].some((keyword) => {
        new RegExp(keyword, "i").test(comment.text);
      });
      if (isBlock) {
        return true;
      }
      return false;
    })();
    if (res) {
      this.logger.warn(
        `--> ${comment.author} 发表的评论包含屏蔽词, 内容: ${comment.text} 屏蔽词: ${comment.text}; IP: ${comment.ip}; `
      );
    }
    return res;
  }

  /**
   * 创建评论
   * @param id 评论 id
   * @param comment 评论内容
   * @param refType 评论类型
   */
  async create(
    id: string,
    comment: Partial<CommentModel>,
    refType?: CommentType
  ) {
    let ref: LeanDocument<DocumentType<WriteBaseModel, BeAnObject>>; // 引用对象, LeanDocument 用于提高性能，DocumentType 用于提高类型检查
    if (refType) {
      const model = this.getModelByRefType(refType); // 获取引用对象的 Model
      ref = await model.findById(id).lean(); // 查找引用对象
    } else {
      const { type: type_, document } = await this.dbService.findGlobalById(id); // 查找引用对象
      ref = document as any;
      refType = type_ as any;
    }
    if (!ref) {
      // 引用对象不存在
      throw new CannotFindException();
    }
    const conmmentIndex = ref.commentsIndex || 0; // 获取引用对象的评论索引
    comment.key = `#${conmmentIndex + 1}`; // 设置评论 key
    const commentCreate = await this.commentModel.create({
      ...comment,
      ref: new Types.ObjectId(ref._id), // 设置引用对象的 _id
      refType,
    });

    await this.dbService.getModelByRefType(refType as any).updateOne(
      { _id: ref._id }, // 更新引用对象的评论索引
      { $inc: { commentsIndex: 1 } } // 增加评论索引
    );

    return commentCreate;
  }

  /**
   * validateName 校验评论名称
   * @param name 名称
   */
  async validateName(name: string): Promise<void> {
    const user = await this.userService.model.findOne({ name });
    if (user) {
      throw new BadRequestException("用户名与主人重名啦！但是您似乎不是主人哎");
    }
  }

  /**
   * delete 删除评论
   * @param id 评论 id
   */
  async delete(id: string) {
    const comment = await this.commentModel.findOneAndDelete({ _id: id });
    if (!comment) {
      throw new CannotFindException();
    }
    // 更新引用对象的评论索引
    const { children, parent } = comment;
    if (children && children.length > 0) {
      // 删除全部的子评论
      await Promise.all(
        children.map(async (child) => {
          await this.commentModel.findByIdAndDelete(child as any as string);
        })
      );
    }
    if (parent) {
      // 更新父评论的评论索引
      const parent = await this.commentModel.findById(comment.parent);
      if (parent) {
        await parent.updateOne({
          $pull: {
            children: comment._id,
          },
        });
      }
    }
  }

  /**
   * allowComment 是否允许评论
   * @param id 评论 id
   * @param refType 评论类型
   */
  async allowComment(id: string, refType?: CommentType) {
    if (refType) {
      const document = await this.getModelByRefType(refType).findById(id);
      if (!document) {
        throw new CannotFindException();
      }
      return document.allowComment ?? true; // 获取引用对象的 allowComment 属性, 如果没有则默认为 true
    } else {
      const { document } = await this.dbService.findGlobalById(id); // 查找引用对象
      if (!document) {
        throw new CannotFindException();
      }
      return document.allowComment ?? true;
    }
  }

  /**
   * getComments 获取评论
   * @param page,size,state
   * @returns 评论列表
   */
  async getComments({ page, size, status } = { page: 1, size: 10, status: 0 }) {
    const queryList = await this.commentModel.paginate(
      { status }, // 查询条件
      {
        page, // 当前页
        limit: size, // 每页显示条数
        select: "+ip +agent -children", // 查询字段
        sort: { created: -1 }, // 排序
        populate: [
          // 关联查询
          { path: "parent", select: "-children" }, // 关联父评论
          { path: "ref", select: "title _id slug nid categoryId" }, // 关联引用对象
        ],
      }
    );
    return queryList;
  }

  /**
   * resloveUrlByType 解析评论引用对象的 url
   * @param type 评论类型
   * @param model 引用对象的 Model
   */
  async resloveUrlByType(type: CommentType, model: any) {
    const {
      urls: { webUrl: base },
    } = await this.configs.waitForConfigReady();
    switch (type) {
      case CommentType.Post:
        return new URL(
          `/${model.category.slug}/${model.slug}`,
          base
        ).toString();
      case CommentType.Page:
        return new URL(`/${model.slug}`, base).toString();
    }
  }

  async attachIpLocation(model: Partial<CommentModel>, ip: string) {
    if (!ip) {
      return model;
    }

    const newModel = { ...model };

    newModel.location = await this.toolsService
      .getIp(ip, 3000)
      .then(
        (res) =>
          `${
            res.province && res.province !== res.cityName
              ? `${res.province}`
              : ""
          }${res.cityName ? `${res.cityName}` : ""}` || undefined
      )
      .catch(() => undefined);

    return newModel;
  }
}
