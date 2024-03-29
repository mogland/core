/*
 * @FilePath: /mog-core/apps/core/src/modules/page/page.module.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:41:58
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-18 11:41:50
 * Coding With IU
 */
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { PageController } from './page.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.page,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [PageController],
})
export class PageModule {}
