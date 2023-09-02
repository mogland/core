import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation } from '@nestjs/swagger';
import { ConfigsInterface } from '~/apps/config-service/src/config.interface';
import { Auth } from '~/shared/common/decorator/auth.decorator';
import { ApiName } from '~/shared/common/decorator/openapi.decorator';
import { ConfigEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { transportReqToMicroservice } from '~/shared/microservice.transporter';

@Controller('configs')
@ApiName
export class ConfigsController {
  constructor(
    @Inject(ServicesEnum.config) private readonly configService: ClientProxy,
  ) {}

  @Get('/ping')
  @ApiOperation({ summary: '测试配置服务是否正常' })
  async ping() {
    return transportReqToMicroservice(
      this.configService,
      ConfigEvents.Ping,
      {},
    );
  }

  @Get('/')
  @Auth()
  @ApiOperation({ summary: '获取所有配置' })
  async getConfigs() {
    return transportReqToMicroservice(
      this.configService,
      ConfigEvents.ConfigGetAllByMaster,
      {},
    );
  }

  @Get('/:key')
  @Auth()
  @ApiOperation({ summary: '获取单个配置' })
  async getConfig(@Param('key') key: keyof ConfigsInterface) {
    return transportReqToMicroservice(
      this.configService,
      ConfigEvents.ConfigGetByMaster,
      key,
    );
  }

  @Patch('/:key')
  @Auth()
  @ApiOperation({ summary: '更新单个配置' })
  async updateConfig(
    @Param('key') key: keyof ConfigsInterface,
    @Body() value: any,
  ) {
    return transportReqToMicroservice(
      this.configService,
      ConfigEvents.ConfigPatchByMaster,
      { key, value },
    );
  }

  @Delete('/:key')
  @Auth()
  @ApiOperation({ summary: '还原单个配置至出厂设置' })
  async deleteConfig(@Param('key') key: keyof ConfigsInterface) {
    return transportReqToMicroservice(
      this.configService,
      ConfigEvents.ConfigDeleteByMaster,
      key,
    );
  }
}
