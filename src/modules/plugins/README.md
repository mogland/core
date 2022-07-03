# Plugin Module

## 功能列表 `All Auth Required`

-  获取插件列表
-  激活插件
-  获取全部已激活的插件
-  获取在某一模块的某一服务下已被激活且可用的插件
-  返回插件处理函数位置
-  调用插件
-  判断插件是否有权限进行读/写

## 插件可以做什么？

比如可以在 post 模块 create 服务的地方，经过此插件时，让插件获取到文章的一些信息，之后再发出请求到某一个地方（如 webhook）也可以做一些正则匹配的修改（shortcode feature）

## manifest.json

NEXT 的插件考虑使用一个 `manifest.json` 先简单描述下插件，之后使用一个 `configs.json` 储存关于此插件的配置（对配置的获取方式有待考究）

你可以在 https://github.com/nx-space/core/blob/main/src/modules/configs/configs.dto.ts 中 PluginDto 中看到关于 manifest.json 的传输定义

## 插件权限控制

- read -- 可传入数据（应该，必须会有的吧？）
- write -- 可修改传入数据（不需要用到的就不要使用此权限，因为越多有这个权限的插件，最终服务器返回数据就会越久）

## PluginService

### getPluginsLists()

获取插件目录内储存的插件列表 -- **存放插件位置在 tmp 的临时目录，`PLUGIN_DIR` 也可获得**

### activePlugin(name: any)

用于激活插件 -- 不直接把存放在插件目录内的插件当作已激活的原因：有可能有部分插件暂时用不上，那会临时关闭，也是便于管理插件

### availablePlugins()

获取目前全部已激活的插件

### getPluginsCanUseInThisService

获取可以在本服务中使用的插件 -- 从 `availablePlugins()` 方法中获取结果再筛选

### returnPluginFn(name: any)

获取此插件函数的存放位置 -- 要先 `availablePlugins()` 获取这个插件是否可用，再用`getPluginsLists()` 获取是否有这个插件文件存在

### canUseInAnywhere(name: any, permission: PluginPermissionsInterface)

用于判断插件是否有xx权限

### usePlugin(name: any, data)

调用插件函数，处理传入的数据，并传出处理后的数据 -- 先检查插件权限，之后输出处理结果（有 write 的就用被插件处理过的数据，readonly的就返回原数据即可）

### 更多...?

