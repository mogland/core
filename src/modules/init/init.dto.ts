/*
 * @FilePath: /nx-core/src/modules/init/init.dto.ts
 * @author: Wibus
 * @Date: 2022-07-13 17:51:08
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-13 17:59:28
 * Coding With IU
 */

import { IsNotEmpty, IsString } from "class-validator";
import { ConfigsInterfaceKeys } from "../configs/configs.interface";

export class InitKeyDto {
  @IsString()
  @IsNotEmpty()
  key: ConfigsInterfaceKeys;
}
