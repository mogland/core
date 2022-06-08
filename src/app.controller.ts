import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AllowAllCorsInterceptor } from './common/interceptors/allow-all-cors.interceptor'
import PKG from '../package.json'

@Controller()
@ApiTags('Root')
export class AppController {
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
