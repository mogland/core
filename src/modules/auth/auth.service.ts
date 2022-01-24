import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import configs from "../../configs";
import { encryptPassword } from "../../utils/crypt.utils";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username, true);
    if (user) {
      const hashedPassword = user.password;
      const hashed = encryptPassword(password, user.uuid); // 加密密码
      if (hashedPassword === hashed) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }else{
        throw new UnauthorizedException('密码错误');
      }
    }else{
      throw new UnauthorizedException("无法找到此用户");
    }
    
  }

  // async checkUser(username: string): Promise<any> {
  async checkUser() {
    const user = await this.usersService.find("auth");
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user[0];
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
      expires: configs.expiration
    };
  }
}
