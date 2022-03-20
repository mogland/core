/*
 * @FilePath: /GS-server/src/modules/friends/friends.module.ts
 * @author: Wibus
 * @Date: 2021-10-23 08:57:09
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-19 21:15:20
 * Coding With IU
 */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GHttp } from "../../helper/helper.http.service";
import { Friends } from "../../shared/entities/friends.entity";
import { FriendsController } from "./friends.controller";
import { FriendsService } from "./friends.service";
@Module({
  // registered friends module
  imports: [TypeOrmModule.forFeature([Friends])],
  providers: [FriendsService, GHttp], // 使用 FriendsService 注入模块
  controllers: [FriendsController], // 使用 FriendsController 注入模块
  exports: [TypeOrmModule],// 使用 TypeOrmModule 注入模块
})
export class FriendsModule {} // 导出模块
