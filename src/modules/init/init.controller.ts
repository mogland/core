import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, UnprocessableEntityException } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiName } from '~/common/decorator/openapi.decorator';
import { ConfigsService } from '../configs/configs.service';
import { InitKeyDto } from './init.dto';
import { InitService } from './init.service';

@Controller('init')
@ApiName
export class InitController {
  constructor(
    private readonly configs: ConfigsService,
    private readonly init: InitService,
  ) {}

  @Get("/")
  @ApiOperation({ summary: '获取初始化情况' })
  async isInit() {
    return {
      isInit: await this.init.isInit(),
    }
  }

  @Get("/configs/default")
  @ApiOperation({ summary: '获取默认配置' })
  async initDefault() {
    const { isInit } = await this.isInit();
    if (isInit) throw new ForbiddenException("默认设置在完成注册之后不可见");
    return this.configs.defaultConfig;

  }

  @Patch("/configs/:key")
  @ApiOperation({ summary: '初始化与更新配置' })
  async setConfig(@Param() params: InitKeyDto, @Body() body: Record<string, any>) {
    const { isInit } = await this.isInit();
    if (isInit) throw new BadRequestException("已经完成初始化, 请登录后进行设置");
    if (typeof body !== 'object') {
      throw new UnprocessableEntityException('body must be object')
    }
    return this.configs.patchAndValidate(params.key, body)
  }
}
