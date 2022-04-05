#!/bin/bash
###
 # @FilePath: /GS-server/scripts/workflow/test-server.sh
 # @author: Wibus
 # @Date: 2022-03-20 13:31:55
 # @LastEditors: Wibus
 # @LastEditTime: 2022-04-05 17:28:19
 # Coding With IU
### 

MAX_RETRIES=10 # 最大重试次数

node -v

if [[ $? -ne 0 ]]; then
  echo "failed to run node"
  exit 1
fi

nohup node out/index.js 1>/dev/null & # 后台运行
p=$! # 获取进程号
echo "started server with pid $p" # 打印进程号

if [[ $? -ne 0 ]]; then
  echo "failed to run node index.js"
  exit 1
fi

RETRY=0 # retry counter

do_request() {
  curl -f -m 10 localhost:3000/api/v1 -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36'

}

do_request # run once to make sure everything is up

while [[ $? -ne 0 ]] && [[ $RETRY -lt $MAX_RETRIES ]]; do # 当返回值不为0，并且重试次数小于最大重试次数时
  sleep 5
  ((RETRY++)) # 将重试次数+1
  echo -e "RETRY: ${RETRY}\n" # 打印重试次数
  do_request
done
request_exit_code=$? # 获取返回值

echo -e "\nrequest code: ${request_exit_code}\n" # 打印返回值

if [[ $RETRY -gt $MAX_RETRIES ]]; then
  echo -n "Unable to run, aborted"
  kill -9 $p
  exit 1

elif [[ $request_exit_code -ne 0 ]]; then
  echo -n "Request error"
  kill -9 $p
  exit 1

else
  echo -e "\nSuccessfully acquire homepage, passing"
  kill -9 $p
  exit 0
fi
