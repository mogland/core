import { InjectModel } from '@app/db/model.transformer';
import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { RedisKeys } from '~/constants/cache.constant';
import { CacheService } from '~/processors/cache/cache.service';
import { getRedisKey } from '~/utils/redis.util';
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

  /**
   *  setConfigs 设置配置
   * @param config 配置项
   */
  private async setConfig(config: ConfigsInterface){
    const redis = this.redis.getClient() // 获取 redis 客户端
    await redis.set(getRedisKey(RedisKeys.ConfigCache), JSON.stringify(config)) // 将配置写入 redis
  }

  /**
   * getConfigs 获取配置
   * @returns {Promise<ConfigsInterface>}
   */
  public async getConfig(): Promise<Readonly<ConfigsInterface>> {
    const redis = this.redis.getClient() // 获取 redis 客户端
    const config = await redis.get(getRedisKey(RedisKeys.ConfigCache)) // 获取配置
    if (config) {
      return JSON.parse(config) as any
    }
    await this.initConfigs()
    return this.getConfig()
  }

  /**
   * waitForConfigReady 等待配置初始化完成
   * @returns {Promise<ConfigsInterface>}
   */
  public async waitForConfigReady() {
    if (this.configInited) {
      return await this.getConfig()
    }
    const maxCount = 10
    let currentCount = 0
    do {
      if (this.configInited) {
        return await this.getConfig() // 如果已经初始化过了，就直接返回配置
      }
      await sleep(100) // 等待 100ms
      currentCount++
    } while (currentCount < maxCount)

    throw `${currentCount} 次重试 ConfigsService 初始化失败`
  }
}
