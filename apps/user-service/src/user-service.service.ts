import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { compareSync } from 'bcrypt';
import { nanoid } from 'nanoid';
import { BusinessException } from '~/shared/common/exceptions/business.excpetion';
import { CannotFindException } from '~/shared/common/exceptions/cant-find.exception';
import { ErrorCodeEnum } from '~/shared/constants/error-code.constant';
import { InjectModel } from '~/shared/transformers/model.transformer';
import { UserDocument, UserModel } from './user.model';

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
      Partial<Pick<UserModel, 'description' | 'avatar' | 'url'>>,
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
      throw new ForbiddenException('用户名不正确');
    }
    if (!compareSync(password, user.password)) {
      throw new ForbiddenException('密码不正确');
    }

    return user;
  }

  /**
   * 根据username获取某个用户信息
   * @param username 用户名
   */
  async getUserByUsername(username: string, getLoginIp = false) {
    const user = await this.userModel
      .findOne({ username })
      .select(`-authCode${getLoginIp ? ' +lastLoginIp' : ''}`)
      .lean({ virtuals: true });
    if (!user) throw new CannotFindException();
    return user;
  }

  async patchUserData(user: UserDocument, data: Partial<UserModel>) {
    const { password } = data;
    const doc = { ...data };
    if (password !== undefined) {
      const { _id } = user;
      const currentUser = await this.userModel
        .findById(_id)
        .select('+password +apiToken');

      if (!currentUser) {
        throw new BusinessException(ErrorCodeEnum.MasterLostError);
      }
      // 1. 验证新旧密码是否一致
      const isSamePassword = compareSync(password, currentUser.password);
      if (isSamePassword) {
        throw new UnprocessableEntityException('密码可不能和原来的一样哦');
      }

      // 2. 认证码重新生成
      const newCode = nanoid(10);
      doc.authCode = newCode;
    }
    return await this.userModel
      .updateOne({ _id: user._id }, doc)
      .setOptions({ omitUndefined: true });
  }

  /**
   * 记录登陆的足迹(ip, 时间)
   *
   * @async
   * @param {string} ip - string
   * @return {Promise<Record<string, Date|string>>} 返回上次足迹
   */
  async recordFootstep(
    username: string,
    ip: string,
  ): Promise<Record<string, Date | string>> {
    const master = await this.userModel.findOne({ username });
    if (!master) {
      throw new BusinessException(ErrorCodeEnum.MasterLostError);
    }
    const PrevFootstep = {
      lastLoginTime: master.lastLoginTime || new Date(1586090559569),
      lastLoginIp: master.lastLoginIp || null,
    };
    await master.updateOne({
      lastLoginTime: new Date(),
      lastLoginIp: ip,
    });

    this.Logger.warn(`主人已登录, IP: ${ip}`);
    return PrevFootstep as any;
  }
}
