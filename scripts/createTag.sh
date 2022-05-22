###
 # @FilePath: /nx-server/scripts/createTag.sh
 # @author: Wibus
 # @Date: 2022-05-22 15:02:29
 # @LastEditors: Wibus
 # @LastEditTime: 2022-05-22 15:07:59
 # Coding With IU
### 
set -e

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo 'current branch not on main, abort'
  exit 1
fi
# 通过READ 获取当前的版本号
VERSION="$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')"
tag=v"$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')"
yarn changelog
git add .
git commit -a -m "release: $tag"
git push
git tag -a "$tag" -m "$tag" # 添加tag
git push --tags
