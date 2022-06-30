import { Injectable } from '@nestjs/common';
import { PLUGIN_DIR } from '~/constants/path.constant';
import { PluginDto } from '../configs/configs.dto';
import { ConfigsService } from '../configs/configs.service';

@Injectable()
export class PluginsService {

  constructor(
    private readonly configsService: ConfigsService,
  ) { }

  /**
   * 获取文件夹中存在的插件列表
   * @returns {string[]}
   */
  public getPluginsLists(): any {
    const plugins = fs.readdirSync(PLUGIN_DIR)
    // 获取里面全部文件夹的名称
    const pluginList = plugins.filter(plugin => {
      const stat = fs.statSync(path.join(PLUGIN_DIR, plugin))
      return stat.isDirectory()
    }
    )
    return pluginList
  }

  /**
   * 激活插件
   * @param name 插件名称
   */
  public async activePlugin(name: any) {
    const pluginList = this.getPluginsLists()
    if (pluginList.includes(name)) {
      const pluginPath = PLUGIN_DIR
      const manifest = await fs.readJSON(`${pluginPath}/${name}/manifest.json`)
      const configs = await this.configsService.getConfig()
      // 添加一个新的插件
      const data: PluginDto[] = [
        ...configs.plugins,
        {
        name,
        active: true,
        manifest
        }]
      this.configsService.patch("plugins", data)
      return `插件 ${name} 激活成功`
    } else {
      return `插件 ${name} 不存在`
    }
  }

  /**
   * availablePlugins 获取全部可用插件
   * @returns {Promise<any>}
   */
  public async availablePlugins() {
    const plugins = await this.configsService.get("plugins")
    const available = {}
    for (const plugin in plugins) {
      if (plugins[plugin].active) {
        available[plugin] = plugins[plugin]
      }
    return available
  }
}

  /**
   * getPluginsCanUseInThisService 获取可以在本服务中使用的插件
   * @param module 模块名称
   * @param service 服务名称
   * @returns {Promise<any>}
   */
  private async getPluginsCanUseInThisService(module: string, service: string) {
    const plugins = await this.configsService.get("plugins")
    const available = {}
    for (const plugin in plugins) {
      if (plugins[plugin].active && plugins[plugin].manifest.modules.includes(module) && plugins[plugin].manifest.services.includes(service)) {
        available[plugin] = plugins[plugin]
      }
    }
    return available
  }

  /**
   * returnPluginFnPath 返回插件函数路径
   * 已经判断了此插件是否被激活，且是否有函数文件存在
   * @param name 插件名称
   * @returns {Promise<any>}
   */
  private async returnPluginFnPath(name: any) {
    // 要先 availablePlugins() 获取这个插件是否可用，再用getPluginsLists() 获取是否有这个插件文件存在
    if ( this.availablePlugins()[name] && this.getPluginsLists().includes(name) ) {
      const plugins = await this.configsService.get("plugins")
      const plugin = plugins[name]
      return `${PLUGIN_DIR}/${name}/${plugin.manifest.fn}.js`
    }
  }

  /**
   * usePlugin 调用插件
   * @param name 插件名称
   * @param data 插件传递的数据
   * @returns {Promise<any>}
   */
  public async usePlugin(name: any, data: any){
    const pluginPermission = await this.configsService.get("plugins")[name].manifest.permission
    const pluginFnPath = await this.returnPluginFnPath(name)
    const afterData = data
    if (pluginFnPath) {
      const [{ main }] = require(pluginFnPath)
      const result = await main(afterData)
      return pluginPermission.includes("write") ? result : afterData
    } else {
      return data
    }
  }
}
