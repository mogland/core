import camelcaseKeys from 'camelcase-keys'
import { InjectModel } from '@app/db/model.transformer';
import { BadRequestException, Injectable, Logger, ValidationPipe } from '@nestjs/common';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { cloneDeep, mergeWith } from 'lodash';
import { RedisKeys } from '~/constants/cache.constant';
import { CacheService } from '~/processors/cache/cache.service';
import { getRedisKey } from '~/utils/redis.util';
import { UserService } from '../user/user.service';
import { generateInitConfigs } from './configs.init';
import { ConfigsInterface, ConfigsInterfaceKeys } from './configs.interface';
import { ConfigsModel } from './configs.model';
import { LeanDocument } from 'mongoose'
import { UserModel } from '../user/user.model';
import { BeAnObject } from '@typegoose/typegoose/lib/types';
import * as configDto from './configs.dto';
import { validateSync, ValidatorOptions } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';


const allOptionKeys: Set<ConfigsInterfaceKeys> = new Set()
const map: Record<string, any> = Object.entries(configDto).reduce(
  (obj, [key, value]) => {
    const optionKey = (key.charAt(0).toLowerCase() +
      key.slice(1).replace(/Dto$/, '')) as ConfigsInterfaceKeys
    allOptionKeys.add(optionKey)
    return {
      ...obj,
      [`${optionKey}`]: value,
    }
  },
  {},
)

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


  /**
   * initConfigs 初始化配置
   */
  protected async initConfigs() {
    const configs = await this.configModel.find().lean()
    const mergedConfig = this.defaultConfig
    configs.forEach(config => { // 合并配置
      const name = config.name as keyof ConfigsInterface // let's make sure the name is correct
      if (!allOptionKeys.has(name)) {
        this.logger.warn(`配置初始化发现 ${name} 不存在字段`)
        return
      }
      const value = config.value
      mergedConfig[name] = { ...mergedConfig[name], ...value }
    })
    await this.setConfig(mergedConfig)
    this.configInited = true // 设置为已初始化
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
   * get 获取配置
   * @param key 配置项名称
   * @returns {Promise<ConfigsInterface[keyof ConfigsInterface]>}
   */
  public get<T extends keyof ConfigsInterface>(key: T): Promise<Readonly<ConfigsInterface[T]>> {
    return new Promise((resolve, reject) => {
      this.waitForConfigReady()
        .then((config) => {
          resolve(config[key])
        })
        .catch(reject)
    })
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

  validateOptions: ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: true
  }

  private validateWithDto<T extends keyof object>(
    dto: ClassConstructor<T>, data: any
    ): T {

    const model = plainToInstance(dto, data)
    const errors = validateSync(model, this.validateOptions)
    if (errors.length) {
      throw this.validate.createExceptionFactory()(errors as any)
    }
    return model
    
  }

  validate = new ValidationPipe(this.validateOptions)

  /**
   * patchAndValidate 更新配置并验证
   * @param key 配置项名称
   * @param data 配置项数据
   * @returns {Promise<ConfigsInterface[T]>}
   */
  async patchAndValidate<T extends keyof ConfigsInterface>(
    key: T,  // 配置项名称
    data: Partial<ConfigsInterface[T]> // 配置项数据
    ): Promise<ConfigsInterface[T]> {
      data = camelcaseKeys(data, { deep: true }) as any

      const dto = map[key] // 获取配置模型
      if (!dto) {
        throw new BadRequestException(`设置 ${key} 不存在`)
      }
      return this.patch(key, this.validateWithDto(dto, data))
    }

  get getUser() {
    return this.userService.getMaster.bind(this.userService) as () => Promise<
      LeanDocument<DocumentType<UserModel, BeAnObject>>
    >
  }
}
