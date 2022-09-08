/*
 * @FilePath: /nx-core/libs/config/src/config.service.ts
 * @author: Wibus
 * @Date: 2022-09-08 21:11:49
 * @LastEditors: Wibus
 * @LastEditTime: 2022-09-08 21:34:06
 * Coding With IU
 */
import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from '~/apps/user-service/src/user.model';
import { CacheService } from '~/libs/cache/src';
import { InjectModel } from '~/libs/database/src/model.transformer';
import { ConfigModel } from './config.model';

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

  protected async initConfig() {
    const config = await this.configModel.find().lean();
  }
}
