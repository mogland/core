import { Module } from '@nestjs/common';
import { ConfigServiceController } from './config-service.controller';
import { ConfigService } from './config-service.service';
import { DatabaseModule } from '~/libs/database/src';
import { CacheModule } from '~/libs/cache/src';
@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [ConfigServiceController],
  providers: [ConfigService],
})
export class ConfigServiceModule {}
