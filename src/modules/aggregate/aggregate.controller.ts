import { CacheKey, CacheTTL, Controller, Get, Query } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { omit } from "lodash";
import { Auth } from "~/common/decorator/auth.decorator";
import { ApiName } from "~/common/decorator/openapi.decorator";
import { IsMaster } from "~/common/decorator/role.decorator";
import { CacheKeys } from "~/constants/cache.constant";
import { ConfigsService } from "../configs/configs.service";
import { TopQueryDto } from "./aggregate.dto";
import { AggregateService } from "./aggregate.service";

@Controller("aggregate")
@ApiName
export class AggregateController {
  constructor(
    private readonly aggregateService: AggregateService,
    private readonly configsService: ConfigsService
  ) {}

  @Get("/")
  @ApiOperation({ summary: "获取概要" })
  @CacheKey(CacheKeys.AggregateCatch)
  @CacheTTL(300)
  async aggregate() {
    const tasks = await Promise.allSettled([
      this.configsService.getMaster(),
      this.aggregateService.getAllCategory(),
      this.aggregateService.getAllPages(),
      this.configsService.get("urls"),
      this.configsService.get("site"),
    ]);
    const [user, categories, pageMeta, urls, sites] = tasks.map((t) => {
      if (t.status === "fulfilled") {
        return t.value;
      } else {
        return null;
      }
    });
    return {
      user,
      sites,
      urls: omit(urls, ["adminUrl"]),
      categories,
      pageMeta,
    };
  }

  @Get("/top")
  @ApiOperation({ summary: "获取网站统计信息" })
  async top(@Query() query: TopQueryDto, @IsMaster() isMaster: boolean) {
    const { size } = query;
    return await this.aggregateService.topActivity(size, isMaster);
  }

  @Get("/sitemap")
  @ApiOperation({ summary: "获取网站sitemap" })
  @CacheKey(CacheKeys.SiteMapCatch)
  @CacheTTL(3600)
  async getSiteMapContent() {
    return { data: await this.aggregateService.getSiteMapContent() };
  }

  @Get("/feed")
  @ApiOperation({ summary: "获取网站RSS" })
  @CacheKey(CacheKeys.RSS)
  @CacheTTL(3600)
  async getRSSFeed() {
    return await this.aggregateService.buildRssStructure();
  }

  @Get("/stat")
  @ApiOperation({ summary: "获取网站统计信息" })
  @Auth()
  async stat() {
    const [count] = await Promise.all([this.aggregateService.getCounts()]);
    return {
      ...count,
    };
  }
}
