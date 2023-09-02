/*
 * @FilePath: /mog-core/apps/core/src/modules/aggregate/aggregate.controller.ts
 * @author: Wibus
 * @Date: 2022-10-01 20:52:08
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-01 20:54:01
 * Coding With IU
 */

import { Controller, Get, Inject, Query } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { IsMaster } from '~/shared/common/decorator/role.decorator';
import { CacheKeys } from '~/shared/constants/cache.constant';
import { TopQueryDto } from './aggregate.dto';
import { AggregateService } from './aggregate.service';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { ClientProxy } from '@nestjs/microservices';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';
import { ConfigEvents } from '~/shared/constants/event.constant';

@Controller('aggregate')
@ApiName
export class AggregateController {
  constructor(
    private readonly aggregateService: AggregateService,
    @Inject(ServicesEnum.config)
    private readonly configService: ClientProxy,
  ) {}

  @Get('/')
  @ApiOperation({ summary: '获取概要' })
  @CacheKey(CacheKeys.AggregateCatch)
  @CacheTTL(300)
  async aggregate(): Promise<{
    categories: any;
    pageMeta: any;
    site: any;
  }> {
    const tasks = await Promise.allSettled([
      // this.configService.getMaster(),
      this.aggregateService.getAllCategory(),
      this.aggregateService.getAllPages(),
      transportReqToMicroservice(
        this.configService,
        ConfigEvents.ConfigGetByMaster,
        'site',
      ),
    ]);
    const [categories, pageMeta, site] = tasks.map((t) => {
      if (t.status === 'fulfilled') {
        return t.value;
      } else {
        return null;
      }
    });
    return {
      categories,
      pageMeta,
      site,
    };
  }

  @Get('/top')
  @ApiOperation({ summary: '获取网站统计信息' })
  async top(@Query() query: TopQueryDto, @IsMaster() isMaster: boolean) {
    const { size } = query;
    return await this.aggregateService.topActivity(size, isMaster);
  }

  @Get('/sitemap')
  @ApiOperation({ summary: '获取网站sitemap' })
  @CacheKey(CacheKeys.SiteMapCatch)
  @CacheTTL(3600)
  async getSiteMapContent(): Promise<{
    data: {
      url: URL;
      published_at: Date;
    }[];
  }> {
    return { data: await this.aggregateService.getSiteMapContent() };
  }

  @Get('/feed')
  @ApiOperation({ summary: '获取网站RSS' })
  @CacheKey(CacheKeys.RSS)
  @CacheTTL(3600)
  async getRSSFeed() {
    return await this.aggregateService.buildRssStructure();
  }

  @Get('/stat')
  @ApiOperation({ summary: '获取网站统计信息' })
  @Auth()
  async stat(): Promise<{
    posts: number;
    pages: number;
    categories: number;
  }> {
    const [count] = await Promise.all([this.aggregateService.getCounts()]);
    return {
      ...count,
    };
  }

  @Get('/clear')
  @ApiOperation({ summary: '清除缓存' })
  @Auth()
  async clearCache() {
    return await this.aggregateService.clearAggregateCache();
  }
}
