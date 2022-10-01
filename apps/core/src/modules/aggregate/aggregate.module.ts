/*
 * @FilePath: /mog-core/apps/core/src/modules/aggregate/aggregate.module.ts
 * @author: Wibus
 * @Date: 2022-10-01 19:50:35
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-01 19:54:55
 * Coding With IU
 */

import { Module } from '@nestjs/common';
import { PageServiceModule } from '~/apps/page-service/src/page-service.module';
import { AggregateService } from './aggregate.service';

@Module({
  imports: [PageServiceModule],
  controllers: [],
  providers: [AggregateService],
  exports: [AggregateService],
})
export class AggregateModule {}
