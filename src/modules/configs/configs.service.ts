import { InjectModel } from '@app/db/model.transformer';
import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { CacheService } from '~/processors/cache/cache.service';
import { UserService } from '../user/user.service';
import { generateInitConfigs } from './configs.init';
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
  }
  private configInited = false // 是否已经初始化过

  public get defaultConfig() {
    return generateInitConfigs()
  }
}
