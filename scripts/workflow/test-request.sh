#!/bin/bash

url_array=("friends" "page" "user" "store" "configs" "themes" "comments")
special_url="http://127.0.0.1:2330/api/ping"
error_items=()
has_errors=false
MAX_RETRIES=3
base_url="http://127.0.0.1:2330/api"
PARAM=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    "pid="*)
      PID_ARG="${1#*=}"
      echo "PID_ARG: $PID_ARG"
      shift
      ;;
    "dev")
      PARAM="dev"
      base_url="http://127.0.0.1:2330"
      special_url="http://127.0.0.1:2330/ping"
      echo "Testing dev server"
      shift
      ;;
    *)
      echo "Unknown argument: $1"
      exit 1
      ;;
  esac
done

do_request() {
  local url="$1"
  local retries=$MAX_RETRIES
  echo "--- Checking $url ---"
  
  while [[ $retries -gt 0 ]]; do
    curl -f -m 10 "$url" -H "user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36"

    if [[ $? -eq 0 ]]; then
      return
    fi

    ((retries--))
    sleep 5
  done

  error_items+=("$url")
  has_errors=true
}

# Check special URL
do_request "$special_url"

# Check other URLs
for item in "${url_array[@]}"; do
  item_url="$base_url/$item/ping"
  do_request "$item_url"
done

if [[ -n "$PID_ARG" ]]; then
  kill "$PID_ARG"
else
  pm2 kill
fi

if $has_errors; then
  echo "Ping errors for the following items:"
  for error_item in "${error_items[@]}"; do
    echo "$error_item"
  done

  exit 1
else
  echo "All pings successful."
fi
