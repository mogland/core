import { Controller } from '@nestjs/common';
import { ConfigService } from './config-service.service';
import { MessagePattern } from '@nestjs/microservices';
import { ConfigEvents } from '~/shared/constants/event.constant';
import { ConfigsInterface } from './config.interface';

@Controller()
export class ConfigServiceController {
  constructor(private readonly configService: ConfigService) {}

  @MessagePattern({ cmd: ConfigEvents.Ping })
  ping() {
    return 'pong';
  }
  
  @MessagePattern({ cmd: ConfigEvents.ConfigGetByMaster })
  async getConfig(key: keyof ConfigsInterface) {
    return await this.configService.get(key);
  }

  @MessagePattern({ cmd: ConfigEvents.ConfigGetAllByMaster })
  async getAllConfig() {
    return await this.configService.waitForConfigReady();
  }

  @MessagePattern({ cmd: ConfigEvents.ConfigGetAllWithoutRedisByMaster })
  async getAllConfigWithoutRedis() {
    return await this.configService.getAllConfigs();
  }

  @MessagePattern({ cmd: ConfigEvents.ConfigPatchByMaster })
  async patchConfigByKey<T extends keyof ConfigsInterface>(input: { key: T; data: ConfigsInterface[T] }) {
    return await this.configService.patchAndValidate(input.key, input.data);
  }

  @MessagePattern({ cmd: ConfigEvents.ConfigDeleteByMaster })
  async deleteConfigByKey<T extends keyof ConfigsInterface>(key: T) {
    return await this.configService.deleteConfig(key);
  }
}
