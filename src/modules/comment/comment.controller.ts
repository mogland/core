/**
 * @copy innei <innei.ren>
 */

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiOperation, ApiParam } from "@nestjs/swagger";
import { DocumentType } from "@typegoose/typegoose";
import { isUndefined } from "lodash";
import { Auth } from "~/common/decorator/auth.decorator";
import { CurrentUser } from "~/common/decorator/current-user.decorator";
import { HTTPDecorators } from "~/common/decorator/http.decorator";
import { IpLocation, IpRecord } from "~/common/decorator/ip.decorator";
import { ApiName } from "~/common/decorator/openapi.decorator";
import { IsMaster } from "~/common/decorator/role.decorator";
import { CannotFindException } from "~/common/exceptions/cant-find.exception";
import { MongoIdDto } from "~/shared/dto/id.dto";
import { PagerDto } from "~/shared/dto/pager.dto";
import { transformDataToPaginate } from "~/transformers/paginate.transformer";
import { UserModel } from "../user/user.model";
import {
  CommentDto,
  CommentRefTypesDto,
  CommentStatusPatchDto,
  TextOnlyDto,
} from "./comment.dto";
import { CommentModel, CommentStatus } from "./comment.model";
import { CommentService } from "./comment.service";

@Controller("comment")
@ApiName
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get("/")
  @Auth()
  async getRecentlyComments(@Query() query: PagerDto) {
    const { size = 10, page = 1, status = 0 } = query;
    return transformDataToPaginate(
      await this.commentService.getComments({ size, page, status })
    );
  }

  @Get("/:id")
  @ApiOperation({ summary: "根据 comment id 获取评论, 包括子评论" })
  async getComments(@Param() params: MongoIdDto) {
    const { id } = params;
    const data = await this.commentService.model
      .findOne({
        _id: id,
      })
      .populate("parent"); // 获取父评论
    if (!data) {
      throw new CannotFindException();
    }
    return data;
  }

  @Get("/ref/:id")
  @ApiOperation({ summary: "根据评论的 refId 获取评论, 如 Post Id" })
  @HTTPDecorators.Paginator
  async getCommentsByRefId(
    @Param() params: MongoIdDto,
    @Query() query: PagerDto
  ) {
    const { id } = params;
    const { page = 1, size = 10 } = query;
    const comments = await this.commentService.model.paginate(
      {
        parent: undefined,
        ref: id, // 查询的是评论的 refId
        $or: [
          {
            state: CommentStatus.Read,
          },
          { state: CommentStatus.Unread },
        ],
      },
      {
        limit: size,
        page,
        sort: { pin: -1, created: -1 },
      }
    );
    return comments;
  }

  @Post("/:id")
  @ApiOperation({ summary: "根据文章的 _id 评论" })
  async comment(
    @Param() params: MongoIdDto,
    @Body() body: CommentDto,
    @IsMaster() isMaster: boolean,
    @IpLocation() ipLocation: IpRecord,
    @Query() query: CommentRefTypesDto
  ) {
    if (!isMaster) {
      await this.commentService.validateName(body.author);
    }
    const { ref } = query;

    const id = params.id;
    if (!(await this.commentService.allowComment(id, ref)) && !isMaster) {
      throw new ForbiddenException("主人禁止了评论");
    }

    const model: Partial<CommentModel> =
      await this.commentService.attachIpLocation(
        // 增加 ip 归属地地址
        { ...body, ...ipLocation },
        isMaster ? "" : ipLocation.ip
      );

    const comment = await this.commentService.create(id, model, ref);

    return comment;
  }

  @Post("/reply/:id")
  @ApiParam({
    name: "id",
    description: "cid",
    example: "5e7370bec56432cbac578e2d",
  })
  async replyByCid(
    @Param() params: MongoIdDto,
    @Body() body: CommentDto,
    @Body("author") author: string,
    @IsMaster() isMaster: boolean,
    @IpLocation() ipLocation: IpRecord
  ) {
    if (!isMaster) {
      await this.commentService.validateName(author);
    }

    const { id } = params;

    const parent = await this.commentService.model.findById(id).populate("ref");
    if (!parent) {
      throw new CannotFindException();
    }
    const commentIndex = parent.commentsIndex; // 获取评论的索引
    const key = `${parent.key}#${commentIndex}`;

    const model: Partial<CommentModel> =
      await this.commentService.attachIpLocation(
        {
          parent,
          ref: (parent.ref as DocumentType<any>)._id,
          refType: parent.refType,
          ...body,
          ...ipLocation,
          key,
        },
        isMaster ? "" : ipLocation.ip
      );

    const comment = await this.commentService.model.create(model);

    await parent.updateOne({
      $push: {
        children: comment._id,
      },
      $inc: {
        commentsIndex: 1,
      },
      state:
        comment.status === CommentStatus.Read &&
        parent.status !== CommentStatus.Read
          ? CommentStatus.Read
          : parent.status,
    });
    return comment;
  }

  @Post("/master/comment/:id")
  @ApiOperation({ summary: "主人专用评论接口 需要登录" })
  @Auth()
  async commentByMaster(
    @CurrentUser() user: UserModel,
    @Param() params: MongoIdDto,
    @Body() body: TextOnlyDto,
    @IpLocation() ipLocation: IpRecord,
    @Query() query: CommentRefTypesDto
  ) {
    const { name, mail, url } = user;
    const model: CommentDto = {
      author: name,
      ...body,
      mail,
      url,
      state: CommentStatus.Read,
    } as CommentDto;
    return await this.comment(params, model as any, true, ipLocation, query);
  }

  @Post("/master/reply/:id")
  @ApiOperation({ summary: "主人专用评论回复 需要登录" })
  @ApiParam({ name: "id", description: "cid" })
  @Auth()
  async replyByMaster(
    @Req() req: any,
    @Param() params: MongoIdDto,
    @Body() body: TextOnlyDto,
    @IpLocation() ipLocation: IpRecord
  ) {
    const { name, mail, url } = req.user;
    const model: CommentDto = {
      author: name,
      ...body,
      mail,
      url,
      state: CommentStatus.Read,
    } as CommentDto;
    // @ts-ignore
    return await this.replyByCid(params, model, undefined, true, ipLocation);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "修改评论的状态" })
  @Auth()
  async modifyCommentState(
    @Param() params: MongoIdDto,
    @Body() body: CommentStatusPatchDto
  ) {
    const { id } = params;
    const { status, pin } = body;

    const updateResult = {} as any;

    !isUndefined(status) && Reflect.set(updateResult, "status", status);
    !isUndefined(pin) && Reflect.set(updateResult, "pin", pin);

    if (pin) {
      const currentRefModel = await this.commentService.model
        .findOne({
          _id: id,
        })
        .lean()
        .populate("ref");

      const refId = (currentRefModel?.ref as any)?._id;
      if (refId) {
        await this.commentService.model.updateMany(
          {
            ref: refId,
          },
          {
            pin: false,
          }
        );
      }
    }

    try {
      return await this.commentService.model.updateOne(
        {
          _id: id,
        },
        updateResult
      );
    } catch {
      throw new CannotFindException();
    }
  }

  @Delete("/:id")
  @Auth()
  async deleteComment(@Param() params: MongoIdDto) {
    const { id } = params;
    await this.commentService.delete(id);
    return;
  }
}
