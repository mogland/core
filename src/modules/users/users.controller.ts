// import { Body, Controller, Post } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
// import { CreateUserDto } from "../../shared/dto/create-user-dto";
// import { UsersService } from "./users.service";

/*
 * @FilePath: /GS-server/src/modules/users/users.controller.ts
 * @author: Wibus
 * @Date: 2022-01-18 22:25:49
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-20 13:54:03
 * Coding With IU
 */
@Controller("users")
@ApiTags("Users")
export class UsersController {
  // constructor(
  //   private usersService: UsersService
  // ) {}

  // 创建用户
  // @Post("create")
  // async create(@Body() data: CreateUserDto) {
  //   return await this.usersService.create(data)
  // }
}