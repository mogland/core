/*
 * @FilePath: /nx-core/src/common/decorator/cookie.decorator.ts
 * @author: Wibus
 * @Date: 2022-07-18 16:33:58
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-18 16:49:42
 * Coding With IU
 */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 获取 header 中的 cookie
    const cookies = request.headers.cookie;
    console.log(cookies);
    // 解析 cookie
    const cookie = cookies ? cookies.split("; ") : [];
    const cookieObj = {};
    cookie.forEach((item) => {
      const [key, value] = item.split("=");
      cookieObj[key] = value;
    });
    return data ? cookieObj[data] : cookieObj;
  }
);
