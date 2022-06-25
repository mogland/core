import { InjectModel } from '@app/db/model.transformer';
import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { CacheService } from '~/processors/cache/cache.service';
import { UserService } from '../user/user.service';
import { generateInitConfigs } from './configs.init';
import { ConfigsInterface } from './configs.interface';
import { ConfigsModel } from './configs.model';

@Injectable()
export class ConfigsService {
  private logger: Logger
  constructor(
    @InjectModel(ConfigsModel)
    private readonly configModel: ReturnModelType<typeof ConfigsModel>,
    private readonly userService: UserService,
    private readonly redis: CacheService
  ) {
    this.logger = new Logger(ConfigsService.name)
    this.initConfigs().then(() => {
      this.logger.log('ConfigsService 初始化完成')
    })
  }
  private configInited = false // 是否已经初始化过

  public get defaultConfig() {
    return generateInitConfigs()
  }

  allOptionKeys: Set<keyof ConfigsInterface> = new Set() // 全部配置项

  /**
   * initConfigs 初始化配置
   */
  protected async initConfigs() {
    const configs = await this.configModel.find().lean()
    const mergedConfigs = this.defaultConfig
    configs.forEach(config => { // 合并配置
      const name = config.name as keyof ConfigsInterface // let's make sure the name is correct
      if (!this.allOptionKeys.has(name)) { // 如果这个配置项不存在
        this.allOptionKeys.add(name) // 添加到全部配置项中
      }
      mergedConfigs[name] = {
        ...mergedConfigs[name],
        ...config.value
      }
    })
  }
}
