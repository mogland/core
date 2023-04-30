import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ReturnModelType } from '@typegoose/typegoose';
import { compareSync } from 'bcrypt';
import { AuthService } from '~/libs/auth/src';
import { IpRecord } from '~/shared/common/decorator/ip.decorator';
import { ExceptionMessage } from '~/shared/constants/echo.constant';
import { NotificationEvents } from '~/shared/constants/event.constant';
import { ServicesEnum } from '~/shared/constants/services.constant';
import { BadRequestRpcExcption } from '~/shared/exceptions/bad-request-rpc-exception';
import { ForbiddenRpcExcption } from '~/shared/exceptions/forbidden-rpc-exception';
import { NotFoundRpcExcption } from '~/shared/exceptions/not-found-rpc-exception';
import { InjectModel } from '~/shared/transformers/model.transformer';
import { getAvatar } from '~/shared/utils';
import { LoginDto } from './user.dto';
import { UserModel, UserRole } from './user.model';
import { v4 } from 'uuid';

@Injectable()
export class UserService {
  private Logger = new Logger(UserService.name);

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,

    private readonly authService: AuthService,

    @Inject(ServicesEnum.notification)
    private readonly notification: ClientProxy,
  ) { }
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
    let hasPassword = false
    // TODO：初始化当前用户的文章、页面、分类
    if (!model.password) {
      model.password = v4();
    } else {
      hasPassword = true
    }

    const exist = await this.userModel.findOne({ username: model.username });
    if (exist)
      throw new ForbiddenRpcExcption(ExceptionMessage.UserNameIsExist);

    const userCount = await this.userModel.countDocuments();

    // 角色控制若完成后，应删除此行下方的代码
    const hasMaster = !!userCount;
    // 禁止注册两个以上账户
    if (hasMaster) {
      throw new BadRequestRpcExcption(ExceptionMessage.UserIsExist);
    }

    const res = await this.userModel.create({
      ...model,
      role: userCount ? UserRole.visitor : UserRole.root,
    });
    const token = await this.authService.jwtServicePublic.sign(res.id);
    return {
      username: res.username,
      token,
      tempPassword: hasPassword ? undefined : model.password,
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
      throw new ForbiddenRpcExcption(ExceptionMessage.UserNameError);
    }
    if (!compareSync(password, user.password)) {
      throw new ForbiddenRpcExcption(ExceptionMessage.UserPasswordError);
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
    this.notification.emit(NotificationEvents.SystemUserLogin, {
      dto,
      ipLocation,
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
      throw new NotFoundRpcExcption(ExceptionMessage.UserNotFound);
    }
    return user;
  }

  /**
   * 更新用户信息
   * @param user 用户信息
   * @param data 更新的数据
   */
  async patchUserData(data: Partial<UserModel>) {
    const { password } = data;
    const doc = { ...data };
    if (password !== undefined) {
      const { id } = data;
      const currentUser = await this.userModel
        .findById(id)
        .select('+password +apiToken');

      if (!currentUser) {
        throw new NotFoundRpcExcption(ExceptionMessage.UserNotFound);
      }
      // 1. 验证新旧密码是否一致
      const isSamePassword = compareSync(password, currentUser.password);
      if (isSamePassword) {
        throw new BadRequestRpcExcption(ExceptionMessage.UserPasswordIsSame);
      }

      // // 2. 认证码重新生成
      // const newCode = nanoid(10);
      // doc.authCode = newCode;

      // 3. 撤销所有token
      await this.signoutAll();
    }
    return await this.userModel
      .updateOne({ _id: data.id }, doc)
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
      throw new NotFoundRpcExcption(ExceptionMessage.UserNotFound);
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

  async getMaster() {
    const master = await this.userModel.findOne({ role: UserRole.root });
    if (!master) {
      throw new NotFoundRpcExcption(ExceptionMessage.UserNotFound);
    }
    return master;
  }
}
