set -e

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "main" ]]; then
  echo 'current branch not on main, abort'
  exit 1
fi

# 获取package.json的版本号
tag="$(node -p "require('./package.json').version")"  
yarn changelog
git add .
git commit -a -m "release: $tag" &>/dev/null
git push
git tag -a "$tag" -m "Release $tag" &>/dev/null
git push --tags
