#!/bin/bash

node -v

if [[ $? -ne 0 ]]; then
  echo "failed to run node"
  exit 1
fi

npm i -g pm2

pm2 -v

if [[ $? -ne 0 ]]; then
  echo "failed to run pm2"
  exit 1
fi

pm2 start ecosystem.bundle.config.js

sleep 60

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
bash $DIR/test-request.sh