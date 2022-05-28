###
 # @FilePath: /nx-server/scripts/upstream.sh
 # @author: Wibus
 # @Date: 2022-03-06 20:22:17
 # @LastEditors: Wibus
 # @LastEditTime: 2022-05-28 16:27:15
 # Coding With IU
### 
# git remote -v
# 如果 git remote -v 命令 不包含nx-space
if [ ! -n "$(git remote -v | grep nx-space)" ]; then
git init
git remote add upstream https://github.com/nx-space/nx-server.git
git remote -v
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
else
echo "非个人远程仓库，无需操作"
exit
fi