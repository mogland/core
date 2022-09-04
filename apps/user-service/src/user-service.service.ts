import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { compareSync } from 'bcrypt';
import { nanoid } from 'nanoid';
import { InjectModel } from '~/shared/transformers/model.transformer';
import { UserModel } from './user.model';

@Injectable()
export class UserService {
  private Logger = new Logger(UserService.name);

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
  ) {}
  public get model() {
    return this.userModel;
  }
  /**
   * 注册用户
   * @param model 用户模型
   */
  async register(
    model: Pick<UserModel, 'username' | 'nickname' | 'password'> &
      Partial<Pick<UserModel, 'description' | 'avatar' | 'url' | 'role'>>,
  ) {
    const authCode = nanoid(10);
    // TODO：初始化当前用户的文章、页面、分类
    const exist = await this.userModel.findOne({ username: model.username });
    if (exist) throw new BadRequestException('用户名已存在');

    const res = await this.userModel.create({
      ...model,
      authCode,
    });
    return {
      username: res.username,
      authCode: res.authCode,
    };
  }

  /**
   * 登录用户
   * @param username 用户名
   * @param password 密码
   */
  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).select('+password');
    if (!user) {
      await sleep(3000);
      throw new ForbiddenException('用户名不正确');
    }
    if (!compareSync(password, user.password)) {
      await sleep(3000);
      throw new ForbiddenException('密码不正确');
    }

    return user;
  }
}
