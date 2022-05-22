###
 # @FilePath: /nx-server/scripts/createTag.sh
 # @author: Wibus
 # @Date: 2022-05-22 15:02:29
 # @LastEditors: Wibus
 # @LastEditTime: 2022-05-22 15:53:22
 # Coding With IU
### 
set -e

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo 'current branch not on main, abort'
  exit 1
fi

tag=v"$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')"

# 现在的GIT tag
CURRENT_TAG="$(git describe --tags --abbrev=0)"
echo "current tag: $CURRENT_TAG"

# 使用 read 命令 获取co
read -p "commit message: " COMMIT_MES
read -p "NEW TAGS? (y/n): " NEW_TAG

yarn changelog
git add .
if [[ -z "$COMMIT_MES" ]]; then
  COMMIT_MES="release: $tag"
fi
git commit -m "$COMMIT_MES"
git push
# 如果 NEW_TAG 为 y 则执行
if [[ "$NEW_TAG" == "y" ]]; then
  git tag -a "$tag" -m "$tag"
  git push --tags
fi
# 如果 NEW_TAG 为 n 则执行
if [[ "$NEW_TAG" == "n" ]]; then
  echo "no new tag"
fi
