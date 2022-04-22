###
 # @FilePath: /GS-server/scripts/upstream.sh
 # @author: Wibus
 # @Date: 2022-03-06 20:22:17
 # @LastEditors: Wibus
 # @LastEditTime: 2022-04-23 07:02:50
 # Coding With IU
### 
# git remote -v
# 如果 git remote -v 命令 不包含wibus-wee
if [ ! -n "$(git remote -v | grep wibus-wee)" ]; then
git init
git remote add upstream https://github.com/wibus-wee/GS-server.git
git remote -v
git fetch upstream
git checkout main
git merge upstream/main
git config --global --add safe.directory /github/workspace
git push origin main
else
echo "非组织远程仓库，无需操作"
exit
fi