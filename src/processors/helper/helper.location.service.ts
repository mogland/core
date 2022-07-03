import { UnprocessableEntityException } from "@nestjs/common";
import { isIPv4, isIPv6 } from "net";
import { HttpService } from "./helper.http.service";

/*
 * @FilePath: /nx-core/src/processors/helper/helper.location.service.ts
 * @author: Wibus
 * @Date: 2022-07-03 20:54:24
 * @LastEditors: Wibus
 * @LastEditTime: 2022-07-03 21:11:36
 * Coding With IU
 */
export class LocationService {
  constructor(
    private readonly http: HttpService,
  ){}

  async getIp(ip: string, timeout = 3000){
    const isV4 = isIPv4(ip)
    const isV6 = isIPv6(ip)
    if (!isV4 && !isV6) {
      throw new UnprocessableEntityException('Invalid IP')
    }
    const url = `https://api.live.bilibili.com/client/v1/Ip/getInfoNew?ip=${ip}`
    const { data } = await this.http.axiosRef.get(url, { timeout })

    const res = {
      country: data.data.country,
      province: data.data.province,
      cityName: data.data.city,
      isp: data.data.isp,
      ip: data.data.ip,
    }

    return res
    
  }
}