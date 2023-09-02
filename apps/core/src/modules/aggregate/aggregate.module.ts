/*
 * @FilePath: /mog-core/apps/core/src/modules/aggregate/aggregate.module.ts
 * @author: Wibus
 * @Date: 2022-10-01 19:50:35
 * @LastEditors: Wibus
 * @LastEditTime: 2022-10-01 20:54:25
 * Coding With IU
 */

import { Module } from '@nestjs/common';
import { PageServiceModule } from '~/apps/page-service/src/page-service.module';
import { AggregateController } from './aggregate.controller';
import { AggregateService } from './aggregate.service';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';

@Module({
  imports: [
    PageServiceModule, // FIX: https://github.com/mogland/core/issues/845
    ClientsModule.register([
      {
        name: ServicesEnum.config,
        ...REDIS_TRANSPORTER,
      },
      {
        name: ServicesEnum.page,
        ...REDIS_TRANSPORTER,
      }
    ]),
  ],
  controllers: [AggregateController],
  providers: [AggregateService],
  exports: [AggregateService],
})
export class AggregateModule {}
