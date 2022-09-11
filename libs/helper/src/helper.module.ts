import { Provider, Global, Module } from '@nestjs/common';
import { CacheModule } from '~/libs/cache/src';
import { HttpService } from './helper.http.service';
import { JWTService } from './helper.jwt.service';

const providers: Provider<any>[] = [HttpService, JWTService];

@Global()
@Module({
  imports: [CacheModule],
  providers,
  exports: providers,
})
export class HelperModule {}
