import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Auth } from "~/common/decorator/auth.decorator";
import { Paginator } from "~/common/decorator/http.decorator";
import { ApiName } from "~/common/decorator/openapi.decorator";
import { CannotFindException } from "~/common/exceptions/cant-find.exception";
import { MongoIdDto } from "~/shared/dto/id.dto";
import { PagerDto } from "~/shared/dto/pager.dto";

import { PageModel, PartialPageModel } from "./page.model";
import { PageService } from "./page.service";

@Controller("page")
@ApiName
export class PageController {
  constructor(
    private readonly pageService: PageService // @Inject(forwardRef(() => PluginsService)) // private readonly pluginService: PluginsService,
  ) {}

  @Get("/")
  @Paginator
  @ApiOperation({ summary: "获取页面列表" })
  async getPagesSummary(@Query() query: PagerDto) {
    const { size, select, page, sortBy, sortOrder } = query;
    return this.pageService.model.paginate(
      {},
      {
        page,
        limit: size,
        select,
        sort: sortBy
          ? { [sortBy]: sortOrder || -1 }
          : { order: -1, modified: -1 },
      }
    );
  }

  @Get("/:id")
  @ApiOperation({ summary: "通过id获取页面详情" })
  @Auth()
  async getPage(@Param() params) {
    const page = this.pageService.model
      .findById(params.id)
      .lean({ getters: true }); // getters: true to get the virtuals
    if (!page) {
      throw new CannotFindException();
    }
    return page;
  }

  @Get("/slug/:slug")
  @ApiOperation({ summary: "使用slug获取页面详情" })
  async getPageBySlug(@Param("slug") slug: string) {
    if (typeof slug !== "string") {
      throw new UnprocessableEntityException("slug必须是字符串");
    }
    const page = await this.pageService.model
      .findOne({
        slug,
      })
      .lean({ getters: true });

    if (!page) {
      throw new CannotFindException();
    }

    // page.text = await this.pluginService.usePlugins('page', 'render', page.text)

    return page;
  }

  @Post("/create")
  @ApiOperation({ summary: "创建页面" })
  @Auth()
  async create(@Body() body: PageModel) {
    return this.pageService.create(body);
  }

  @Put("/:id")
  @ApiOperation({ summary: "更新页面" })
  @Auth()
  async modify(@Body() body: PageModel, @Param() params: MongoIdDto) {
    const { id } = params;
    // body.text = await this.pluginService.usePlugins('page', 'update', body.text)
    await this.pageService.updateById(id, body);

    return await this.pageService.model.findById(id).lean();
  }

  @Patch("/:id")
  @ApiOperation({ summary: "更新页面" })
  @Auth()
  async patch(@Body() body: PartialPageModel, @Param() params: MongoIdDto) {
    const { id } = params;
    // body.text = await this.pluginService.usePlugins('page', 'update', body.text)
    await this.pageService.updateById(id, body);

    return;
  }

  @Delete("/:id")
  @ApiOperation({ summary: "删除页面" })
  @Auth()
  async deletePage(@Param() params: MongoIdDto) {
    await this.pageService.model.deleteOne({
      _id: params.id,
    });
    return;
  }
}
