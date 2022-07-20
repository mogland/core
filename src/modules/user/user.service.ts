import { compareSync } from "bcrypt";
import { nanoid } from "nanoid";

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";

import { BusinessException } from "~/common/exceptions/business.excpetion";
import { ErrorCodeEnum } from "~/constants/error-code.constant";
import { InjectModel } from "~/transformers/model.transformer";

import { AuthService } from "../auth/auth.service";
import { UserDocument, UserModel } from "./user.model";
import { PageService } from "../page/page.service";
import { PostService } from "../post/post.service";
import { CategoryService } from "../category/category.service";

@Injectable()
export class UserService {
  private Logger = new Logger(UserService.name);
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly authService: AuthService,
    private readonly postService: PostService,
    private readonly pageService: PageService,
    private readonly categoryService: CategoryService
  ) { }
  public get model() {
    return this.userModel;
  }
  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).select("+password");
    if (!user) {
      // await sleep(3000)
      throw new ForbiddenException("用户名不正确");
    }
    if (!compareSync(password, user.password)) {
      // await sleep(3000)
      throw new ForbiddenException("密码不正确");
    }

    return user;
  }

  /**
   * 获取主人的信息
   * @param getLoginIp - 获取登陆ip
   * @returns {Promise<LeanDocument>}
   */
  async getMasterInfo(getLoginIp = false) {
    const user = await this.userModel
      .findOne()
      .select(`-authCode${getLoginIp ? " +lastLoginIp" : ""}`)
      .lean({ virtuals: true });
    if (!user) {
      throw new BadRequestException("没有完成初始化!");
    }

    return { ...user };
  }
  async hasMaster() {
    return !!(await this.userModel.countDocuments());
  }

  public async getMaster() {
    const master = await this.userModel.findOne().lean();
    if (!master) {
      throw new BadRequestException("我还没有主人");
    }
    return master;
  }

  /**
   * 初始化主人
   * @param model - 用户模型
   * @returns {Promise<{token: string; username: string; authCode: string;}>}
   */
  async createMaster(
    model: Pick<UserModel, "username" | "name" | "password"> &
      Partial<Pick<UserModel, "introduce" | "avatar" | "url">>
  ) {
    const hasMaster = await this.hasMaster();
    // 禁止注册两个以上账户
    if (hasMaster) {
      throw new BadRequestException("我已经有一个主人了哦");
    }
    const authCode = nanoid(10);

    // 初始化文章、页面、分类
    const defaultCate = (await this.categoryService.findAllCategory()).find(
      (cate) => cate.slug === "default"
    )
      ? await (
        await this.categoryService.findAllCategory()
      ).find((cate) => cate.slug === "default")
      : await this.categoryService.createDefaultCategory();
    const defaultCateId = defaultCate ? defaultCate._id : undefined;
    if (!defaultCateId) {
      throw new BadRequestException("初始化分类失败");
    } else {
      await Promise.all([
        this.postService.create({
          title: "欢迎来到 NEXT",
          slug: "welcome-to-next",
          text: "欢迎来到 NEXT，当你看到这条文章的时候，说明你已经成功的安装并初始化了 NEXT。",
          summary: "欢迎来到 NEXT",
          categoryId: defaultCateId,
          category: defaultCate,
        }),
        this.pageService.create({
          title: "NEXT 的第一个页面",
          slug: "welcome-to-next-page",
          text: "欢迎来到 NEXT，当你看到这个页面的时候，说明你已经成功的安装并初始化了 NEXT。",
        }),
      ]);
      Logger.log("初始化文章、页面、分类成功");
    }

    // @ts-ignore
    const res = await this.userModel.create({ ...model, authCode });
    const token = await this.authService.signToken(res._id);
    return { token, username: res.username, authCode: res.authCode };
  }

  /**
   * 修改密码
   *
   * @async
   * @param {DocumentType} user - 用户查询结果, 已经挂载在 req.user
   * @param {Partial} data - 部分修改数据
   */
  async patchUserData(
    user: UserDocument,
    data: Partial<UserModel>
  ): Promise<any> {
    const { password } = data;
    const doc = { ...data };
    if (password !== undefined) {
      const { _id } = user;
      const currentUser = await this.userModel
        .findById(_id)
        .select("+password +apiToken");

      if (!currentUser) {
        throw new BusinessException(ErrorCodeEnum.MasterLostError);
      }
      // 1. 验证新旧密码是否一致
      const isSamePassword = compareSync(password, currentUser.password);
      if (isSamePassword) {
        throw new UnprocessableEntityException("密码可不能和原来的一样哦");
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
  async recordFootstep(ip: string): Promise<Record<string, Date | string>> {
    const master = await this.userModel.findOne();
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
