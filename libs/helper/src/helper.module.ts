import { Provider, Global, Module } from '@nestjs/common';
import { HttpService } from './helper.http.service';

const providers: Provider<any>[] = [HttpService];

@Global()
@Module({
  providers,
  exports: providers,
})
export class HelperModule {}
