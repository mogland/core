/*
 * @FilePath: /nx-core/libs/config/src/config.service.ts
 * @author: Wibus
 * @Date: 2022-09-08 21:11:49
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-09 21:14:52
 * Coding With IU
 */

import camelcaseKeys from 'camelcase-keys';
import {
  BadRequestException,
  Injectable,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync, ValidatorOptions } from 'class-validator';
import { cloneDeep, mergeWith } from 'lodash-es';
import { UserModel } from '~/apps/user-service/src/user.model';
import { CacheService } from '~/libs/cache/src';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { RedisKeys } from '~/shared/constants/cache.constant';
import { getRedisKey } from '~/shared/utils';
import { DefaultConfigs } from './config.default';
import { ConfigsInterface, ConfigsInterfaceKeys } from './config.interface';
import { ConfigModel } from './config.model';
import * as configDto from './config.dto';

const allOptionKeys: Set<ConfigsInterfaceKeys> = new Set();
const map: Record<string, any> = Object.entries(configDto).reduce(
  (obj, [key, value]) => {
    const optionKey = (key.charAt(0).toLowerCase() +
      key.slice(1).replace(/Dto$/, '')) as ConfigsInterfaceKeys;
    allOptionKeys.add(optionKey);
    return {
      ...obj,
      [`${optionKey}`]: value,
    };
  },
  {},
);

@Injectable()
export class ConfigService {
  private logger = new Logger(ConfigService.name);
  constructor(
    @InjectModel(ConfigModel)
    private readonly configModel: ReturnModelType<typeof ConfigModel>,
    @InjectModel(UserModel)
    private readonly userModel: MongooseModel<UserModel>,
    private readonly redis: CacheService,
  ) {}
  private configInit = false;

  public get defaultConfig() {
    return DefaultConfigs;
  }

  validateOptions: ValidatorOptions = {
    whitelist: true,
    forbidNonWhitelisted: true,
  };

  private validateWithDto<T extends keyof object>(
    dto: ClassConstructor<T>,
    data: any,
  ): T {
    const model = plainToInstance(dto, data);
    const errors = validateSync(model, this.validateOptions);
    if (errors.length) {
      throw this.validate.createExceptionFactory()(errors as any);
    }
    return model;
  }

  validate = new ValidationPipe(this.validateOptions);

  /**
   * patchAndValidate 更新配置并验证
   * @param key 配置项名称
   * @param data 配置项数据
   * @returns {Promise<ConfigsInterface[T]>}
   */
  async patchAndValidate<T extends keyof ConfigsInterface>(
    key: T, // 配置项名称
    data: Partial<ConfigsInterface[T]>, // 配置项数据
  ): Promise<ConfigsInterface[T]> {
    data = camelcaseKeys(data, { deep: true }) as any;

    const dto = map[key]; // 获取配置模型
    if (!dto) {
      throw new BadRequestException(`设置 ${key} 不存在`);
    }
    return this.patch(key, this.validateWithDto(dto, data));
  }

  /**
   * waitForConfigReady 等待配置初始化完成
   */
  public async waitForConfigReady() {
    if (this.configInit) {
      return await this.getConfig();
    }
    const maxCount = 10;
    let currentCount = 0;
    do {
      if (this.configInit) {
        return await this.getConfig(); // 如果已经初始化过了，就直接返回配置
      }
      await sleep(100); // 等待 100ms
      currentCount++;
    } while (currentCount < maxCount);

    throw `${currentCount} 次重试 ConfigsService 初始化失败`;
  }

  /**
   * getConfigs 获取配置
   */
  public async getConfig(): Promise<Readonly<ConfigsInterface>> {
    const redis = this.redis.getClient(); // 获取 redis 客户端
    const config = await redis.get(getRedisKey(RedisKeys.ConfigCache)); // 获取配置
    if (config) {
      return JSON.parse(config) as any;
    }
    await this.initConfig();
    return this.getConfig();
  }

  /**
   * patch 更新配置
   * @param key 配置项名称
   * @param data 配置项数据
   * @returns {Promise<ConfigsInterface[T]>}
   */
  public async patch<T extends keyof ConfigsInterface>(
    key: T, // 配置项名称
    data: Partial<ConfigsInterface[T]>, // 配置项数据
  ): Promise<ConfigsInterface[T]> {
    const config = await this.getConfig(); // 获取配置
    const updatedConfigRow = await this.configModel // 获取配置模型
      .findOneAndUpdate(
        // 更新配置
        { name: key as string }, // 查询条件, 只更新 name 为 key 的配置
        {
          value: mergeWith(cloneDeep(config[key]), data, (old, newer) => {
            // 合并配置。如果有新的配置，就覆盖旧的配置
            // 数组不合并
            if (Array.isArray(old)) {
              return newer;
            }
            // 对象合并
            if (typeof old === 'object' && typeof newer === 'object') {
              return { ...old, ...newer };
            }
          }),
        },
        { upsert: true, new: true }, // 如果不存在，就创建一个新的配置
      )
      .lean(); // 获取配置，并且转换为对象
    const newData = updatedConfigRow.value; // 获取更新后的配置
    const mergedFullConfig = Object.assign({}, config, { [key]: newData }); // 合并配置，把更新后的配置添加到配置中
    await this.setConfig(mergedFullConfig); // 将配置写入 redis
    return newData;
  }

  /**
   *  setConfigs 设置配置
   * @param config 配置项
   */
  private async setConfig(config: ConfigsInterface) {
    const redis = this.redis.getClient(); // 获取 redis 客户端
    await redis.set(getRedisKey(RedisKeys.ConfigCache), JSON.stringify(config)); // 将配置写入 redis
  }

  protected async initConfig() {
    const configs = await this.configModel.find().lean();
    const defaultConfigs = this.defaultConfig();

    // 合并新的配置
    configs.forEach((config) => {
      const name = config.name as keyof ConfigsInterface;
      const value = config.value;
      defaultConfigs[name] = { ...defaultConfigs[name], ...value };
    });

    await this.setConfig(defaultConfigs);

    this.configInit = true;
  }

  /**
   * getAllConfigs 获取所有配置
   */
  async getAllConfigs() {
    const config = await this.configModel.find().lean();
    return config;
  }
}
