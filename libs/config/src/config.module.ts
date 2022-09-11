import { Module } from '@nestjs/common';
import { DatabaseModule } from '~/libs/database/src';
import { ConfigService } from './config.service';

@Module({
  imports: [DatabaseModule],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
