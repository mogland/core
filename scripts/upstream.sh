###
 # @FilePath: /GS-server/scripts/upstream.sh
 # @author: Wibus
 # @Date: 2022-03-06 20:22:17
 # @LastEditors: Wibus
 # @LastEditTime: 2022-03-06 20:27:40
 # Coding With IU
### 
cd ..
# git remote -v
# 如果 git remote -v 命令 不包含wibus-wee
if [ ! -n "$(git remote -v | grep wibus-wee)" ]; then
git remote add upstream https://github.com/wibus-wee/GS-server.git
git remote -v
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
else
echo "非组织远程仓库"
fi