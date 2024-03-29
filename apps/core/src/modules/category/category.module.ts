/*
 * @FilePath: /mog-core/apps/core/src/modules/category/category.module.ts
 * @author: Wibus
 * @Date: 2022-09-24 15:42:05
 * @LastEditors: Wibus
 * @LastEditTime: 2022-11-18 11:41:46
 * Coding With IU
 */
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { REDIS_TRANSPORTER } from '~/shared/constants/transporter.constants';
import { CategoryController } from './category.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: ServicesEnum.category,
        ...REDIS_TRANSPORTER,
      },
    ]),
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}
