import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ReturnModelType } from '@typegoose/typegoose';
import { compareSync } from 'bcrypt';
// import { nanoid } from 'nanoid';
import { AuthService } from '~/libs/auth/src';
import { IpRecord } from '~/shared/common/decorator/ip.decorator';
import { BusinessException } from '~/shared/common/exceptions/business.excpetion';
import {
  ErrorCodeEnum,
  RequestStatusEnum,
} from '~/shared/constants/error-code.constant';
import { InjectModel } from '~/shared/transformers/model.transformer';
import { getAvatar } from '~/shared/utils';
import { LoginDto } from './user.dto';
import { UserDocument, UserModel } from './user.model';

@Injectable()
export class UserService {
  private Logger = new Logger(UserService.name);

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,

    private readonly authService: AuthService,
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
    // const authCode = nanoid(10);

    // TODO：初始化当前用户的文章、页面、分类

    const exist = await this.userModel.findOne({ username: model.username });
    if (exist) throw new BadRequestException('用户名已存在');

    // 角色控制若完成后，应删除此行下方的代码
    const count = await this.userModel.countDocuments();
    const hasMaster = !!(await this.userModel.countDocuments());
    // 禁止注册两个以上账户
    if (hasMaster) {
      throw new BadRequestException('我已经有一个主人了哦');
    }

    const res = await this.userModel.create({ ...model });
    const token = await this.authService.jwtServicePublic.sign(res.id);
    return {
      username: res.username,
      token,
    };
  }

  /**
   * 1. 返回登录用户信息
   * @param username 用户名
   * @param password 密码
   */
  async returnLoginData(username: string, password: string) {
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
   * 2. 登录
   * @param dto 登录信息
   * @param ipLocation ip地址
   */
  async login(dto: LoginDto, ipLocation: IpRecord) {
    const user = await this.returnLoginData(dto.username, dto.password);
    const footstep = await this.recordFootstep(dto.username, ipLocation.ip);
    const { nickname, username, created, url, email, id } = user;
    const avatar = user.avatar ?? getAvatar(email);
    const token = this.authService.jwtServicePublic.sign(user.id, {
      user,
      ip: ipLocation.ip,
      ua: ipLocation.agent,
    });
    return {
      token,
      ...footstep,
      nickname,
      username,
      created,
      url,
      email,
      avatar,
      id,
    };
  }

  async signout(token: string) {
    return this.authService.jwtServicePublic.revokeToken(token);
  }

  async signoutAll() {
    return this.authService.jwtServicePublic.revokeAll();
  }

  async getAllSignSession(token: string) {
    return this.authService.jwtServicePublic.getAllSignSession(token);
  }

  /**
   * 根据username获取某个用户信息
   * @param username 用户名
   */
  async getUserByUsername(username: string, getLoginIp = false) {
    const user = await this.userModel
      .findOne({ username })
      .select(`${getLoginIp ? ' +lastLoginIp' : ''}`)
      .lean({ virtuals: true });
    if (!user) {
      throw new RpcException({
        status: RequestStatusEnum.NotFound,
        message: '用户不存在',
      });
    }
    return user;
  }

  /**
   * 更新用户信息
   * @param user 用户信息
   * @param data 更新的数据
   */
  async patchUserData(user: UserDocument, data: Partial<UserModel>) {
    const { password } = data;
    const doc = { ...data };
    if (password !== undefined) {
      const { _id } = user;
      const currentUser = await this.userModel
        .findById(_id)
        .select('+password +apiToken');

      if (!currentUser) {
        throw new RpcException(
          new BusinessException(ErrorCodeEnum.MasterLostError),
        );
      }
      // 1. 验证新旧密码是否一致
      const isSamePassword = compareSync(password, currentUser.password);
      if (isSamePassword) {
        throw new UnprocessableEntityException('密码可不能和原来的一样哦');
      }

      // // 2. 认证码重新生成
      // const newCode = nanoid(10);
      // doc.authCode = newCode;

      // 3. 撤销所有token
      await this.signoutAll();
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

    this.Logger.warn(`${master.username} 已登录 IP: ${ip}`);
    return PrevFootstep as any;
  }

  async getMaster() {}
}
