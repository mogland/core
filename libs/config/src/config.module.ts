import { Global, Module } from '@nestjs/common';
import { CacheModule } from '~/libs/cache/src';
import { DatabaseModule } from '~/libs/database/src';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [DatabaseModule, CacheModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
