/*
 * @FilePath: /Nest-server/host/host.module.ts
 * @author: Wibus
 * @Date: 2021-10-01 17:17:41
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-02 14:56:26
 * Coding With IU
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HostController } from 'host/host.controller';
import { HostService } from 'host/host.service';
import { Host } from './host.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Host])],
  providers: [HostService],
  controllers: [HostController],
  exports: [TypeOrmModule]
})
export class HostModule {}