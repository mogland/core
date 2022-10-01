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
import {
  ServicePorts,
  ServicesEnum,
} from '~/shared/constants/services.constant';
import { PageController } from './page.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.page,
        transport: Transport.TCP,
        options: {
          port: ServicePorts.page,
        },
      },
    ]),
  ],
  controllers: [PageController],
})
export class PageModule {}
