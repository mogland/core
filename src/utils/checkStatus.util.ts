/*
 * @FilePath: /GS-server/src/utils/checkStatus.util.ts
 * @author: Wibus
 * @Date: 2021-09-26 22:32:28
 * @LastEditors: Wibus
 * @LastEditTime: 2022-01-23 20:21:41
 * Coding With IU
 */

import axios from 'axios';

export const checkStatus = async (url: string) => {
  // 防止connect ECONNREFUSED
  const options = {
    url: url,
    timeout: 5000,
    maxRedirects: 0,
    maxContentLength: 2000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
    },
  };
  try {
    // const { status } = await axios(options);
    return await axios(options);
  }
  catch (error) {
    return error;
  }
}