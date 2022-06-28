import { InjectModel } from '@app/db/model.transformer';
import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { cloneDeep, mergeWith } from 'lodash';
import { RedisKeys } from '~/constants/cache.constant';
import { CacheService } from '~/processors/cache/cache.service';
import { getRedisKey } from '~/utils/redis.util';
import { UserService } from '../user/user.service';
import { generateInitConfigs } from './configs.init';
import { ConfigsInterface } from './configs.interface';
import { ConfigsModel } from './configs.model';
import { LeanDocument } from 'mongoose'
import { UserModel } from '../user/user.model';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
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

  /**
   * patch 更新配置
   * @param key 配置项名称
   * @param data 配置项数据
   * @returns {Promise<ConfigsInterface[T]>}
   */
  public async patch<T extends keyof ConfigsInterface>(
    key: T,  // 配置项名称
    data: Partial<ConfigsInterface[T]> // 配置项数据
    ): Promise<ConfigsInterface[T]> {
    const config = await this.getConfig() // 获取配置
    const updatedConfigRow = await this.configModel // 获取配置模型
      .findOneAndUpdate( // 更新配置
        { name: key as string }, // 查询条件, 只更新 name 为 key 的配置
        {
          value: mergeWith(cloneDeep(config[key]), data, (old, newer) => { // 合并配置。如果有新的配置，就覆盖旧的配置
            // 数组不合并
            if (Array.isArray(old)) {
              return newer
            }
            // 对象合并
            if (typeof old === 'object' && typeof newer === 'object') {
              return { ...old, ...newer } 
            }
          }),
        },
        { upsert: true, new: true },  // 如果不存在，就创建一个新的配置
      )
      .lean() // 获取配置，并且转换为对象
    const newData = updatedConfigRow.value // 获取更新后的配置
    const mergedFullConfig = Object.assign({}, config, { [key]: newData }) // 合并配置，把更新后的配置添加到配置中
    await this.setConfig(mergedFullConfig) // 将配置写入 redis
    return newData
  }

  get getUser() {
    return this.userService.getMaster.bind(this.userService) as () => Promise<
      LeanDocument<DocumentType<UserModel, BeAnObject>>
    >
  }
}
