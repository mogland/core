/*
 * @FilePath: /nx-core/src/processors/helper/helper.plugins.service.ts
 * @author: Wibus
 * @Date: 2022-06-29 19:20:35
 * @LastEditors: Wibus
 * @LastEditTime: 2022-06-29 19:39:02
 * Coding With IU
 */

let folder
if (process.env.NODE_ENV === 'development') {
  folder = `${__dirname}/../src/plugins`
} else {
  folder = './plugins'
}

/**
 * Helper Plugins Service
 * @description 插件服务
 */
export class HelperPluginsService {
  
  constructor() {}

  public getPlugins(): any {
    const plugins = fs.readdirSync(path.resolve(__dirname, folder))
    return plugins
  }

  public async getPluginIntro(name: any){
    const pluginList = this.getPlugins()
    if (pluginList.includes(name)) {
      const pluginPath = path.resolve(__dirname, `${folder}/${name}`)
      const manifest = await fs.readJSON(`${pluginPath}/manifest.json`)
      return manifest
    }
  }
}