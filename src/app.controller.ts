import { Controller, Get, Param, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AllowAllCorsInterceptor } from './common/interceptors/allow-all-cors.interceptor'
import PKG from '../package.json'
import { PluginsService } from './modules/plugins/plugins.service'

@Controller()
@ApiTags('Root')
export class AppController {

  constructor(
    private readonly pluginsService: PluginsService,
  ){}

  @Get('/plugins_tests/:data')
  async test_plugins(@Param() param: any) {
    return this.pluginsService.usePlugin("nx-hello-world", param.data)
  }


  @UseInterceptors(AllowAllCorsInterceptor)
  @Get(['/', '/info'])
  async appInfo() {
    return {
      name: PKG.name,
      author: PKG.author,
      version: isDev ? 'dev' : PKG.version,
      homepage: PKG.homepage,
      issues: PKG.issues,
    }
  }
  @Get(['/ping'])
  ping(): 'pong' {
    return 'pong'
  }
  
}
