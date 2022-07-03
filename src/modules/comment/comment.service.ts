import { DbService } from '@app/db';
import { InjectModel } from '@app/db/model.transformer';
import BlockedKeywords from './block-keywords.json'
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { BeAnObject, DocumentType } from '@typegoose/typegoose/lib/types';
import { ConfigsService } from '../configs/configs.service';
import { PageModel } from '../page/page.model';
import { PostModel } from '../post/post.model';
import { UserService } from '../user/user.service';
import { CommentModel, CommentType } from './comment.model';
import { LeanDocument, Types } from 'mongoose'
import { WriteBaseModel } from '~/shared/model/base.model';
import { CannotFindException } from '~/common/exceptions/cant-find.exception';
@Injectable()
export class CommentService {
  private readonly logger: Logger = new Logger(CommentService.name);

  constructor(
    @InjectModel(CommentModel)
    private readonly commentModel: MongooseModel<CommentModel>,
    private readonly dbService: DbService,
    private readonly configs: ConfigsService,
    private readonly userService: UserService,
  ) {}

  public get model() {
    return this.commentModel;
  }

  private getModelByRefType(
    refType: CommentType,
  ): ReturnModelType<
    typeof PostModel | typeof PageModel,
    BeAnObject
  > {
    switch (refType) {
      case CommentType.Post:
        return this.dbService.getModelByRefType("post");
      case CommentType.Page:
        return this.dbService.getModelByRefType("page");
      default:
        throw new Error('refType is not supported');
    }
  }

  async checkBlock(comment: CommentModel) {
    const res = await (async () => {
      if ( comment.author === ((await this.userService.getMaster()).username)){
        return false
      }
      const isBlock = [...BlockedKeywords].some(keyword => {
        new RegExp(keyword, 'i').test(comment.text)
      })
      if (isBlock) {
        return true
      }
      return false
    })()
    if (res) {
      this.logger.warn(`--> ${comment.author} 发表的评论包含屏蔽词, 内容: ${comment.text} 屏蔽词: ${comment.text}; IP: ${comment.ip}; `)
    }
    return res
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
    refType: CommentType,
  ){
    let ref: LeanDocument<DocumentType<WriteBaseModel, BeAnObject>> // 引用对象, LeanDocument 用于提高性能，DocumentType 用于提高类型检查
    if (refType) {
      const model = this.getModelByRefType(refType) // 获取引用对象的 Model
      ref = await model.findById(id).lean() // 查找引用对象
    } else {
      const { type: type_, document } = await this.dbService.findGlobalById(id) // 查找引用对象
      ref = document as any 
      refType = type_ as any
    }
    if (!ref) { // 引用对象不存在
      throw new CannotFindException()
    }
    const conmmentIndex = ref.commentsIndex || 0 // 获取引用对象的评论索引
    comment.key = `#${conmmentIndex + 1}` // 设置评论 key
    const commentCreate = await this.commentModel.create({
      ...comment,
      ref: new Types.ObjectId(ref._id), // 设置引用对象的 _id
      refType,
    })

    await this.dbService.getModelByRefType(refType as any).updateOne(
      { _id: ref._id }, // 更新引用对象的评论索引
      { $inc: { commentsIndex: 1 } }, // 增加评论索引
    )

    return commentCreate
  }

  async validateName(name: string): Promise<void> {
    const user = await this.userService.model.findOne({ name })
    if (!user) {
      throw new BadRequestException('用户名与主人重名啦！但是您似乎不是主人哎')
    }
  }

}
