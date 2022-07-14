/*
 * @FilePath: /nx-core/src/modules/tools/tools.module.ts
 * @author: Wibus
 * @Date: 2022-07-03 21:22:26
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-03 21:24:27
 * Coding With IU
 */

import { Global, Module } from "@nestjs/common";

// import { ToolsController } from './tools.controller'
import { ToolsService } from "./tools.service";

@Global()
@Module({
  providers: [ToolsService],
  // controllers: [ToolsController],
  exports: [ToolsService],
})
export class ToolsModule {}
