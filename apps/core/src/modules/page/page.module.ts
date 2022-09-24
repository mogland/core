/*
 * @FilePath: /nx-core/apps/core/src/modules/page/page.module.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:41:58
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-24 15:41:58
 * Coding With IU
 */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.page,
        transport: Transport.TCP,
      },
    ]),
  ],
})
export class PageModule {}
