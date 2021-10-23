/*
 * @FilePath: /GS-server/src/friends/friends.module.ts
 * @author: Wibus
 * @Date: 2021-10-23 08:57:09
 * @LastEditors: Wibus
 * @LastEditTime: 2021-10-23 11:50:47
 * Coding With IU
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friends } from './friend.entry';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
@Module({
  imports: [TypeOrmModule.forFeature([Friends])],
  providers: [FriendsService],
  controllers: [FriendsController],
  exports: [TypeOrmModule]
})
export class FriendsModule {}