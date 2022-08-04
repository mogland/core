import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { mongoose } from "@typegoose/typegoose";
import { Auth } from "~/common/decorator/auth.decorator";
import { Paginator } from "~/common/decorator/http.decorator";
import { ApiName } from "~/common/decorator/openapi.decorator";
import { IsMaster } from "~/common/decorator/role.decorator";
import { PagerDto } from "~/shared/dto/pager.dto";
import { linksDto } from "./links.dto";
import { LinksModel, LinksStatus } from "./links.model";
import { LinksService } from "./links.service";

@Controller("links")
@ApiName
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Get("/")
  @Paginator
  @ApiOperation({ summary: "获取链接(附带分页器)" })
  async gets(@Query() pager: PagerDto, @IsMaster() master: boolean) {
    const { size, page, status } = pager;

    return await this.linksService.model.paginate(
      status !== undefined ? { status } : {},
      {
        limit: size,
        page,
        sort: { created: -1 },
        select: master ? "" : "-email",
      }
    );
  }

  @Get("/all")
  @ApiOperation({ summary: "获取链接(不附带分页器)" })
  async getAll() {
    const condition: mongoose.FilterQuery<LinksModel> = {
      status: LinksStatus.Pass,
    };
    return await this.linksService.model.find(condition).sort({ created: -1 });
  }

  @Get("/count")
  @Auth()
  @ApiOperation({ summary: "获取链接各项总数" })
  async getLinkscount() {
    return await this.linksService.getCount();
  }

  @Post("/apply")
  @ApiOperation({ summary: "申请链接" })
  async apply(@Body() body: linksDto) {
    return await this.linksService.applyForFriendLink(body);
  }

  @Patch("/status/:id")
  @ApiOperation({ summary: "修改链接状态" })
  @Auth()
  async update(@Param() params, @Query() query) {
    const { id } = params;
    const status: LinksStatus = query.status ? query.status : LinksStatus.Pass;
    return await this.linksService.setFriendLinkStatus(id, status);
  }

  @Patch("/:id")
  @ApiOperation({ summary: "修改链接信息" })
  @Auth()
  async updateMes(@Param() params, @Body() body) {
    const { id } = params;
    const status: LinksStatus = body.status ? body.status : LinksStatus.Pass;
    return await this.linksService.model.findByIdAndUpdate(id, {
      status,
      ...body,
    });
  }

  @Auth()
  @Get("/health")
  @ApiOperation({ summary: "检查链接健康状态" })
  async checkHealth() {
    return this.linksService.checkLinksHealth();
  }

  @Get("/feed")
  @ApiOperation({ summary: "获取链接的feed" })
  async getFeed(@Query() params) {
    const { url } = params;
    if (!url) {
      throw new BadRequestException("url is required");
    }
    return await this.linksService.parseRSS(url, params.type);
  }

  @Get("/update")
  @ApiOperation({ summary: "更新拉取友链的feed" })
  async getFriendsFeed() {
    return await this.linksService.getLinksRss();
  }

  @Delete("/:id")
  @Auth()
  @ApiOperation({ summary: "删除链接" })
  async deleteLink(@Param("id") id) {
    return await this.linksService.model.findByIdAndDelete(id);
  }
}
