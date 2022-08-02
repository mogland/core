/*
 * @FilePath: /nx-core/src/modules/configs/configs.controller.ts
 * @author: Wibus
 * @Date: 2022-08-02 23:41:21
 * @LastEditors: Wibus
 * @LastEditTime: 2022-08-03 00:04:59
 * Coding With IU
 */

import { Body, Controller, Get, Patch } from "@nestjs/common";
import { instanceToPlain } from "class-transformer";
import { ApiName } from "~/common/decorator/openapi.decorator";
import { ConfigsInterfaceKeys } from "./configs.interface";
import { ConfigsService } from "./configs.service";


@Controller("configs")
@ApiName
export class ConfigsController {

  constructor(
    private readonly configsService: ConfigsService,
  ) {}

  @Get('/')
  async getOption() {
    const configs = await this.configsService.getAllConfigs()
    let result = {}
    configs.forEach(config => {
      result = {
        ...result,
        [config.name]: config.value,
      }
    })
    return instanceToPlain(result)
  }

  @Patch('/')
  async updateOption(@Body() body: any) {
    for (const key in body) {
      // 将 key 转换为驼峰式
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase()) as unknown as ConfigsInterfaceKeys
      await this.configsService.patchAndValidate(camelKey, body[key])
    }
  }

}