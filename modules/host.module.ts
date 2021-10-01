/*
 * @FilePath: /Nest-server/modules/host.module.ts
 * @author: Wibus
 * @Date: 2021-10-01 17:17:41
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-01 17:40:58
 * Coding With IU
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostController } from 'host/host.controller';
import { HostService } from 'services/host.service';
import { Host } from '../entities/host.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Host])],
  providers: [HostService],
  controllers: [HostController],
  exports: [TypeOrmModule]
})
export class HostModule {}