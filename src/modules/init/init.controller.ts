import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Logger,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Auth } from "~/common/decorator/auth.decorator";
import { ApiName } from "~/common/decorator/openapi.decorator";
import { ConfigsInterface } from "../configs/configs.interface";
import { ConfigsService } from "../configs/configs.service";
import { InitService } from "./init.service";

@Controller("init")
@Auth()
@ApiName
export class InitController {
  constructor(
    private readonly configs: ConfigsService,
    private readonly init: InitService
  ) {}

  @Get("/")
  @ApiOperation({ summary: "获取初始化情况" })
  async canInit() {
    return await this.init.canInit();
  }

  @Get("/configs/get/default")
  @ApiOperation({ summary: "获取默认配置" })
  async initDefault() {
    const { can_init } = await this.canInit();
    if (!can_init)
      throw new ForbiddenException("无法获取默认配置，请检查控制台日志");
    return this.configs.defaultConfig;
  }

  @Get("/configs/default")
  @ApiOperation({ summary: "初始化默认配置" })
  async setConfig() {
    const { can_init } = await this.canInit();
    if (!can_init)
      throw new BadRequestException("无法完成初始化，请检查控制台日志");
    const defaultConfig = this.configs.defaultConfig;
    for (const theKey in defaultConfig) {
      Logger.warn(`正在初始化默认配置: ${theKey}`, InitController.name);
      const key = theKey as keyof ConfigsInterface; // convert to <keyof ConfigsInterface>
      if (defaultConfig[key] !== undefined) {
        const element = defaultConfig[key];
        await this.configs.patchAndValidate(key, element);
      }
    }
    Logger.warn(`初始化默认配置完成`);
    return {
      canInit: false,
      inited: true,
    };
  }
}
