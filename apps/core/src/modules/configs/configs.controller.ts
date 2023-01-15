import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '~/libs/config/src';
import { ConfigsInterface } from '~/libs/config/src/config.interface';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';

@Controller('configs')
@ApiName
export class ConfigsController {
  constructor(private readonly configService: ConfigService) {
    configService.initConfig();
  }

  @Get('/')
  @Auth()
  @ApiOperation({ summary: '获取所有配置' })
  async getConfigs() {
    return await this.configService.getConfig();
  }

  @Get('/:key')
  @Auth()
  @ApiOperation({ summary: '获取单个配置' })
  async getConfig(@Param('key') key: keyof ConfigsInterface) {
    return await this.configService.get(key);
  }

  @Patch('/:key')
  @Auth()
  @ApiOperation({ summary: '更新单个配置' })
  async updateConfig(
    @Param('key') key: keyof ConfigsInterface,
    @Body() value: any,
  ) {
    return await this.configService.patchAndValidate(key, value);
  }

  @Delete('/:key')
  @Auth()
  @ApiOperation({ summary: '还原单个配置至出厂设置' })
  async deleteConfig(@Param('key') key: keyof ConfigsInterface) {
    return await this.configService.deleteConfig(key);
  }
}
