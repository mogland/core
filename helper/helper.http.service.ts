/*
 * @FilePath: /GS-server/helper/helper.http.service.ts
 * @author: Wibus
 * @Date: 2021-09-26 22:32:28
 * @LastEditors: Wibus
 * @LastEditTime: 2022-03-19 21:14:57
 * Coding With IU
 */

import type { AxiosInstance } from 'axios'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import { version } from '../package.json'
export class GHttp {
  private http: AxiosInstance
  constructor() {
    this.http = axios.create({
      timeout: 10000,
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36 GS-Space/' +
          version,
      },
    })
    axiosRetry(this.http, {
      retries: 3,
      retryDelay: (count) => {
        return 1000 * count
      },
      shouldResetTimeout: true,
    })
  }

  public get axiosRef() {
    return this.http
  }
}
