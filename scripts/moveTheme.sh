###
 # @FilePath: /ns-server/scripts/moveTheme.sh
 # @author: Wibus
 # @Date: 2022-05-21 21:24:45
 # @LastEditors: Wibus
 # @LastEditTime: 2022-05-21 21:29:29
 # Coding With IU
### 

rm -rf ./dist/src/views/default
cp -rf ./src/views/default ./dist/src/views/
echo "ok"