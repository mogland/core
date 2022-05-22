###
 # @FilePath: /nx-server/scripts/createTag.sh
 # @author: Wibus
 # @Date: 2022-05-22 15:02:29
 # @LastEditors: Wibus
 # @LastEditTime: 2022-05-22 15:18:28
 # Coding With IU
### 
set -e

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo 'current branch not on main, abort'
  exit 1
fi

tag=v"$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')"
# 使用 read 命令 获取co
read -p "commit message: " COMMIT_MES

yarn changelog
git add .
if [[ -z "$COMMIT_MES" ]]; then
  COMMIT_MES="chore(release): $tag"
fi
git commit -m "$COMMIT_MES"
git push
git tag -a "$tag" -m "$tag" # 添加tag
git push --tags
