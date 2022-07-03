import { BadRequestException, Injectable } from '@nestjs/common';
import { PLUGIN_DIR } from '~/constants/path.constant';
import { safeEval } from '~/utils/safe-eval.util';
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
  public getPluginsLists(): string[] {
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
   * @return {Promise<string>}
   */
  public async activePlugin(name: string): Promise<string> {
    // fs检查文件夹是否存在
    if (fs.existsSync(path.join(PLUGIN_DIR, name))) {
      const plugins = await this.availablePlugins()
      if (!plugins[name]) {
        const pluginList = this.getPluginsLists()
        if (pluginList.includes(name)) {
          const pluginPath = PLUGIN_DIR
          const manifest = await fs.readJSON(`${pluginPath}/${name}/manifest.json`).catch(() => {
            throw new BadRequestException(`${name} 插件的 manifest.json 文件不存在`)
          })
          const configs = await this.configsService.getConfig()
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
          throw new BadRequestException(`插件 ${name} 不存在`)
        }
      } else {
        throw new BadRequestException(`插件 ${name} 已处于激活状态`)
      }
    } else {
      throw new BadRequestException(`插件 ${name} 不存在`)
    }
  }

  /**
   * availablePlugins 获取全部可用插件
   * @returns {Promise<string>}
   */
  public async availablePlugins(): Promise<any> {
    const plugins = await this.configsService.get("plugins")
    let available = {}
    for (const plugin in plugins) {
      if (plugins[plugin].active) {
        available = {
          ...available,
          [plugins[plugin].name]: {
            ...plugins[plugin],
          }
        }
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
  private async getPluginsCanUseInThisService(module: string, service: string): Promise<any> {
    const plugins = await this.configsService.get("plugins")
    const available = {}
    for (const plugin in plugins) {
      if (plugins[plugin].active && plugins[plugin].manifest.module === module && plugins[plugin].manifest.service === service) {
        available[plugin] = plugins[plugin]
      }
    }
    return available
  }

  /**
   * returnPluginFnPath 返回插件函数路径
   * 已经判断了此插件是否被激活，且是否有函数文件存在
   * @param name 插件名称
   * @returns {Promise<string>}
   */
  private async returnPluginFnPath(name: string): Promise<string | null> {
    // 要先 availablePlugins() 获取这个插件是否可用，再用getPluginsLists() 获取是否有这个插件文件存在
    const pluginsList = await this.availablePlugins()
    if (pluginsList[name] && this.getPluginsLists().includes(name)) {
      const plugin = pluginsList[name]
      return `${PLUGIN_DIR}/${name}/${plugin.manifest.fn}.js`
    } else {
      return null
    }
  }

  /**
   * usePlugin 调用插件
   * @param name 插件名称
   * @param data 插件传递的数据
   * @returns {Promise<string>}
   */
  public async usePlugin(name: string, data: string): Promise<string> {
    const pluginsList = await this.availablePlugins()
    const pluginPermissions = pluginsList[name].manifest.permissions

    const pluginFnPath = await this.returnPluginFnPath(name)
    const afterData = data
    if (pluginFnPath) {
      const pluginFn = fs.readFileSync(pluginFnPath, 'utf8')
      const pluginFnStr = `(async () => {
        ${pluginFn}
        const plugin = new NxPlugin()
        return plugin.main(${data})
      })()`
      const pluginFnResult = safeEval(pluginFnStr)
      return pluginPermissions.includes("write") ? pluginFnResult : afterData
    } else {
      return data
    }
  }


  /**
   * usePlugins 调用插件
   * @param module 模块名称
   * @param service 服务名称
   * @param data 数据
   * @returns {Promise<string>}
   */
  public async usePlugins(module: string, service: string, data: any): Promise<string> {
    const plugins = await this.getPluginsCanUseInThisService(module, service)
    const afterData = data
    // for (const plugin in plugins) {
    //   const result = await this.usePlugin(plugin, afterData)
    //   return result
    // }
    const result = await Promise.all(Object.keys(plugins).map(async (plugin) => {
      this.usePlugin(plugin, afterData)
    }))
    return result.join("\n")
  }
}
