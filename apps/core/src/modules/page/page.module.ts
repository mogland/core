/*
 * @FilePath: /mog-core/apps/core/src/modules/page/page.module.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:41:58
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-18 11:41:50
 * Coding With IU
 */
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';
import { getEnv } from '~/shared/utils/rag-env';
import { PageController } from './page.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.page,
        transport: Transport.TCP,
        options: {
          port: getEnv(ServicesEnum.page)?.port || ServicePorts.page,
          host: getEnv(ServicesEnum.page)?.host || undefined,
        },
      },
    ]),
  ],
  controllers: [PageController],
})
export class PageModule {}
