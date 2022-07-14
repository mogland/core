/*
 * @FilePath: /nx-core/src/modules/comment/comment.model.ts
 * @author: Wibus
 * @Date: 2022-07-03 17:49:03
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-03 19:01:21
 * Coding With IU
 */

import { DocumentType, modelOptions, pre, prop } from "@typegoose/typegoose";
import { BaseModel } from "~/shared/model/base.model";
import { Query, Types } from "mongoose";
import { BeAnObject, Ref } from "@typegoose/typegoose/lib/types";
import { PostModel } from "../post/post.model";
import { PageModel } from "../page/page.model";

function autoPopulateSubs(
  this: Query<
    // this is a query
    any,
    DocumentType<CommentModel, BeAnObject>,
    {},
    DocumentType<CommentModel, BeAnObject>
  >,
  next: () => void
) {
  this.populate({
    options: {
      sort: { created: -1 },
    },
    path: "children",
  });
  next();
}

// 评论种类
export enum CommentType {
  Post = "Post",
  Page = "Page",
}

// 评论状态
export enum CommentStatus {
  Unread,
  Read,
  Rubbish,
}

@modelOptions({
  options: {
    customName: "comment",
  },
})
@pre<CommentModel>("find", autoPopulateSubs) // 自动填充子评论
@pre<CommentModel>("findOne", autoPopulateSubs) // 自动填充子评论
export class CommentModel extends BaseModel {
  @prop({ refPath: "type" })
  ref: Ref<PostModel | PageModel>; // 引用的文章或页面

  @prop({ required: true, enum: CommentType, default: "Post" })
  refType: CommentType; // 评论种类

  @prop({ trim: true, required: true })
  author!: string;

  @prop({ trim: true })
  email!: string;

  @prop({
    trim: true,
    set(val: string) {
      return new URL(val).origin;
    },
  })
  urls?: string;

  @prop({ required: true })
  text: string;

  @prop({ default: 0 })
  status: CommentStatus;

  @prop({ ref: () => CommentModel })
  parent?: Ref<CommentModel>; // 父评论

  @prop({ ref: () => CommentModel, type: Types.ObjectId })
  children?: Ref<CommentModel>[]; // 子评论

  @prop({ default: 1 })
  commentsIndex?: number; // 评论顺序

  @prop()
  key?: string; // 评论key

  @prop({ select: false })
  ip?: string; // 评论ip

  @prop()
  public location?: string; // 评论地点, 根据IP获取归属地

  @prop({ select: false })
  agent?: string;

  @prop({
    ref: () => PostModel, // 评论的文章
    foreignField: "_id", // 指定外键字段
    localField: "ref", // 指定当前字段
    justOne: true, // 只查询一条
  })
  public post: Ref<PostModel>;

  @prop({
    ref: () => PageModel,
    foreignField: "_id",
    localField: "ref",
    justOne: true,
  })
  public page: Ref<PageModel>;
}
