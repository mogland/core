/*
 * @FilePath: /GS-server/./host/host.module.ts
 * @author: Wibus
 * @Date: 2021-10-01 17:17:41
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-09 22:17:39
 * Coding With IU
 */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HostController } from "./host.controller";
import { HostService } from "./host.service";
import { Host } from "./host.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Host])],
  providers: [HostService],
  controllers: [HostController],
  exports: [TypeOrmModule],
})
export class HostModule {}
