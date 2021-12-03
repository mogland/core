/*
 * @FilePath: /GS-server/src/friends/friends.module.ts
 * @author: Wibus
 * @Date: 2021-10-23 08:57:09
 * @LastEditors: Wibus
 * @LastEditTime: 2021-12-04 06:40:28
 * Coding With IU
 */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Friends } from "./friends.entity";
import { FriendsController } from "./friends.controller";
import { FriendsService } from "./friends.service";
@Module({
  // registered friends module
  imports: [TypeOrmModule.forFeature([Friends])],
  providers: [FriendsService], // 使用 FriendsService 注入模块
  controllers: [FriendsController], // 使用 FriendsController 注入模块
  exports: [TypeOrmModule],// 使用 TypeOrmModule 注入模块
})
export class FriendsModule {} // 导出模块
