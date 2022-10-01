/*
 * @FilePath: /mog-core/apps/core/src/modules/aggregate/aggregate.service.ts
 * @author: Wibus
 * @Date: 2022-10-01 19:52:38
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-01 19:54:56
 * Coding With IU
 */

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CategoryService } from '~/apps/page-service/src/category.service';
import { PageService } from '~/apps/page-service/src/page-service.service';
import { PostService } from '~/apps/page-service/src/post-service.service';
import { CacheService } from '~/libs/cache/src';
import { ConfigService } from '~/libs/config/src';

@Injectable()
export class AggregateService {
  constructor(
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
    @Inject(forwardRef(() => PageService))
    private readonly pageService: PageService,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    private readonly configService: ConfigService,
    private readonly redis: CacheService,
  ) {}
}
